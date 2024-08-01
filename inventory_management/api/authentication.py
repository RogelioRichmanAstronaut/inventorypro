from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from jose import jwt
from django.conf import settings
from .utils import get_rsa_key

class SimpleUser:
    def __init__(self, payload):
        self.payload = payload
        self.is_authenticated = True  # This makes the user authenticated

    def __str__(self):
        return self.payload.get('sub', 'unknown')

class Auth0JSONWebTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return None

        parts = auth.split()
        if parts[0].lower() != 'bearer':
            raise AuthenticationFailed('Authorization header must start with Bearer')

        token = parts[1]
        try:
            rsa_key = get_rsa_key(token)
            if not rsa_key:
                raise AuthenticationFailed('Unable to find appropriate key')

            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=['RS256'],
                audience=settings.API_IDENTIFIER,
                issuer=settings.JWT_ISSUER
            )

            user = SimpleUser(payload)
            return (user, None)  # Return the user-like object and no authentication object
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token is expired')
        except jwt.JWTClaimsError:
            raise AuthenticationFailed('Incorrect claims, please check the audience and issuer')
        except jwt.JWTError as e:
            raise AuthenticationFailed(f'Unable to parse authentication token. Error: {str(e)}')
        except Exception as e:
            raise AuthenticationFailed(f'An error occurred. Error: {str(e)}')