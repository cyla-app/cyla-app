import React from "react";

import { DayService } from "./generated/openapi";
import { Day } from "./generated/day";
// @ts-ignore
import themisWasm from "./themis/libthemis.wasm";
import * as themis from "./themis";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ShareScreen from "./screens/ShareScreen";
import HomeScreen from "./screens/HomeScreen";
import {
  AppBar,
  createMuiTheme,
  CssBaseline,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Container,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import AppIcon from "./assets/app_icon.png";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  appIcon: {
    margin: theme.spacing(1),
    width: 50,
    height: 50,
  },
  title: {
    flexGrow: 1,
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
              <div>
                <img className={classes.appIcon} src={AppIcon} />
              </div>
              <Typography variant="h6" className={classes.title}></Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>

          <Switch>
            <Route path="/share/:shareId">
              <ShareScreen />
            </Route>
            <Route path="/">
              <HomeScreen />
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
