import requests
from jose import jwt
from django.conf import settings

def get_jwks():
    jwks_url = f'https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json'
    response = requests.get(jwks_url)
    response.raise_for_status()
    return response.json()

def get_rsa_key(token):
    jwks = get_jwks()
    unverified_header = jwt.get_unverified_header(token)
    
    rsa_key = {}
    for key in jwks['keys']:
        if key['kid'] == unverified_header['kid']:
            rsa_key = {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e']
            }
            break
    
    if not rsa_key:
        raise ValueError("RSA key not found")
    
    return rsa_key