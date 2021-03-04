import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OpenAPI, ShareDayService, ShareService } from "../generated/openapi";
import { Day } from "../generated/day";
import * as themis from "../themis";
import { sub } from "date-fns";
// @ts-ignore
import themisWasm from "../themis/libthemis.wasm";
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
}));

export default () => {
  const { shareId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const classes = useStyles();

  useEffect(() => {
    const load = async () => {
      const toDate = new Date();
      const fromDate = sub(toDate, { months: 36 });

      setLoading(true);
      OpenAPI.BASE = "http://localhost:5000";
      const auth = await ShareService.shareAuth(shareId, {
        hashedPwd: "password",
      });
      OpenAPI.TOKEN = auth.jwt!!;

      const days = await ShareDayService.shareGetDayByUserAndRange(
        shareId,
        fromDate.toISOString(),
        toDate.toISOString()
      );
      await themis.initialize(themisWasm);
      const shareKeyCell = themis.SecureCellSeal.withPassphrase("password");
      const shareKey = shareKeyCell.decrypt(base64Decode(auth.shareKey!!));

      const shareCell = themis.SecureCellSeal.withKey(shareKey);

      const dayInfos = days.map((day) => {
        const dayKey = shareCell.decrypt(base64Decode(day.day_key));
        const dayInfoCell = themis.SecureCellSeal.withKey(dayKey);
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
    load().catch((e) => {
      setError(e);
    });
  }, [shareId]);

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
