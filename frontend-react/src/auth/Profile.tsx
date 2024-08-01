import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isAuthenticated ? "flex-start" : "center",
              flexGrow: 1,
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              component={Link}
              to="/"
            >
              <InventoryIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ textAlign: isAuthenticated ? "left" : "center" }}
            >
              DANISANDO-inventory
            </Typography>
          </Box>
          {isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/">
                Inicio
              </Button>
              <Button color="inherit" component={Link} to="/sales">
                Sales
              </Button>
              <Button color="inherit" component={Link} to="/newSale">
                New Sale
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <Avatar
                  alt={user.name}
                  src={user.picture}
                  sx={{ marginRight: 2 }}
                />
                <Typography variant="h6">{user.name}</Typography>
              </Box>
              <LogoutButton />
            </>
          )}
        </Toolbar>
      </AppBar>
      {!isAuthenticated && <LoginButton />}
    </>
  );
};

export default Profile;
