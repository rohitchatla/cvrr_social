import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import auth from "./../auth/auth-helper";
import { Link, withRouter } from "react-router-dom";
import cvrrlogo from "./../assets/images/cvrr_logo.jpg";

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: "red" };
  else return { color: "black" };
};
const Menu = withRouter(({ history }) => (
  <AppBar position="static" color="secondary">
    <Toolbar>
      {/* <Link to={{ pathname: "http://cvrrocket.ga/" }} target="_blank"> */}
      <a href="http://cvrrocket.ga/" target="_blank">
        <img
          class="img"
          src={cvrrlogo}
          alt=""
          width="50"
          height="50"
          style={{ borderRadius: "50%" }}
        ></img>
        {/* </Link> */}
      </a>
      <hr />
      <Typography variant="h6" color="textPrimary">
        CVRR_social
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon />
        </IconButton>
      </Link>
      {!auth.isAuthenticated() && (
        <span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign Up</Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In</Button>
          </Link>
        </span>
      )}
      {auth.isAuthenticated() && (
        <span>
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button
              style={isActive(
                history,
                "/user/" + auth.isAuthenticated().user._id
              )}
            >
              My Profile
            </Button>
          </Link>
          <Button
            color="inherit"
            onClick={() => {
              auth.clearJWT(() => history.push("/"));
            }}
          >
            Log Out
          </Button>
        </span>
      )}
    </Toolbar>
  </AppBar>
));

export default Menu;
