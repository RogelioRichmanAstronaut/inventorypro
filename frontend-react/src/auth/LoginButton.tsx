import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => loginWithRedirect()}
        sx={{ padding: "10px 20px", fontSize: "18px", borderRadius: "8px" }}
      >
        Log In
      </Button>
    </Box>
  );
};

export default LoginButton;
