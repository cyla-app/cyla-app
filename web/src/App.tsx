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
  makeStyles,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import AppIcon from "./assets/app_icon.png";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00075E",
    },
    secondary: {
      main: "#CC1C21",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#ffeded",
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
