import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { OpenAPI, ShareDayService, ShareService } from "../generated/openapi";
import { Day } from "../generated/day";
import { initialize, SecureCellSeal } from "wasm-themis";
import { sub } from "date-fns";
// @ts-ignore
import themisWasm from "wasm-themis/dist/libthemis.wasm";
import {
  Container,
  Grid,
  LinearProgress,
  makeStyles,
  Paper,
  Snackbar,
} from "@material-ui/core";
import minimal from "protobufjs/minimal";
import DayTable from "../components/DayTable";
import TemperatureChart from "../components/TemperatureChart";
import PeriodHeatmap from "../components/PeriodHeatmap";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const base64Decode = (base64: string): Uint8Array => {
  const length = minimal.util.base64.length(base64);
  const buffer = new Uint8Array(length);
  minimal.util.base64.decode(base64, buffer, 0);
  return buffer;
};

const useStyles = makeStyles((theme) => ({
  grid: {
    margin: 20,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "start",
    color: theme.palette.text.secondary,
  },
  paperLogin: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

OpenAPI.BASE = "http://localhost:5000";

export default () => {
  const { shareId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [sharePwd, setSharePwd] = useState<string>("");
  const [authSuccessful, setAuthSuccessful] = useState<boolean>(false);
  const classes = useStyles();

  const loadData = async (encryptedShareKey: string) => {
    const toDate = new Date();
    const fromDate = sub(toDate, { months: 36 });

    setLoading(true);

    const days = await ShareDayService.shareGetDayByUserAndRange(
      shareId,
      fromDate.toISOString(),
      toDate.toISOString()
    );
    await initialize(themisWasm);
    const shareKeyCell = SecureCellSeal.withPassphrase(sharePwd);
    const shareKey = shareKeyCell.decrypt(base64Decode(encryptedShareKey));

    const shareCell = SecureCellSeal.withKey(shareKey);

    const dayInfos = days.map((day) => {
      const dayKey = shareCell.decrypt(base64Decode(day.day_key));
      const dayInfoCell = SecureCellSeal.withKey(dayKey);
      return Day.decode(
        dayInfoCell.decrypt(
          base64Decode(day.dayInfo),
          new TextEncoder().encode(day.date)
        )
      );
    });
    setDays(dayInfos);
    setLoading(false);
  };

  if (error) {
    return (
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
        }}
        message={error?.message || "Unknown error"}
      />
    );
  }

  if (!authSuccessful) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paperLogin}>
          <Typography component="h1" variant="h5">
            Authentication
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const authenticate = async () => {
                const auth = await ShareService.shareAuth(shareId, {
                  hashedPwd: sharePwd,
                });
                OpenAPI.TOKEN = auth.jwt!!;
                setSharePwd(sharePwd);
                setAuthSuccessful(true);
                await loadData(auth.shareKey!!);
              };

              authenticate().catch((e) => setError(e));
            }}
            className={classes.form}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              autoComplete="current-password"
              onChange={(e) => setSharePwd(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Continue
            </Button>
          </form>
        </div>
      </Container>
    );
  }

  return (
    <>
      {loading && <LinearProgress color="secondary" />}
      {!loading && !error && (
        <Container maxWidth="lg">
          <h1>Shared medical data</h1>
          <Grid container spacing={3} className={classes.grid}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <TemperatureChart days={days} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <PeriodHeatmap days={days} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <DayTable days={days} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};
