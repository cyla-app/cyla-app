import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DayService,
  OpenAPI,
  ShareDayService,
  ShareService,
  ShareStatsService,
} from "../generated/openapi";
import { Day } from "../generated/day";
import * as themis from "../themis";
import { sub } from "date-fns";
// @ts-ignore
import themisWasm from "../themis/libthemis.wasm";
import { DataGrid, ValueGetterParams } from "@material-ui/data-grid";
import { Box, Container } from "@material-ui/core";
import minimal from "protobufjs/minimal";
import { PeriodStats, PeriodStatsDTO } from "../generated/period-stats";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: ValueGetterParams) =>
      `${params.getValue("firstName") || ""} ${
        params.getValue("lastName") || ""
      }`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const base64Decode = (base64: string): Uint8Array => {
  const length = minimal.util.base64.length(base64);
  const buffer = new Uint8Array(length);
  minimal.util.base64.decode(base64, buffer, 0);
  return buffer;
};

const base64Encode = (buffer: Uint8Array) => {
  return minimal.util.base64.encode(buffer, 0, buffer.length);
};

export default () => {
  let { shareId } = useParams();

  useEffect(() => {
    const load = async () => {
      OpenAPI.BASE = "http://localhost:5000";
      const shareId = "ac1dfa4f-a156-4cbf-b8e8-d62817e786ea";
      const auth = await ShareService.shareAuth(shareId, {
        hashedPwd: "password",
      });

      OpenAPI.TOKEN = auth.jwt!!;

      const days = await ShareDayService.shareGetDayByUserAndRange(
        shareId,
        sub(new Date(), { months: 6 }).toISOString(),
        new Date().toISOString()
      );
      console.log(days);

      const stats = await ShareStatsService.shareGetPeriodStats(shareId);
      console.log(stats);

      console.time("init wasm");
      await themis.initialize(themisWasm);
      console.timeEnd("init wasm");

      console.time("init keys");
      const shareKeyCell = themis.SecureCellSeal.withPassphrase("password");
      const shareKey = shareKeyCell.decrypt(base64Decode(auth.shareKey!!));
      console.timeEnd("init keys");

      const cell = themis.SecureCellSeal.withKey(shareKey);
      console.time("decrypt");
      for (let i = 0; i < 500; i++) {
        PeriodStatsDTO.decode(cell.decrypt(base64Decode(stats.value)));
      }
      console.timeEnd("decrypt");
    };
    load();
  });

  return (
    <>
      <Container maxWidth="sm">
        <Box style={{ height: 400 }} my={4}>
          <h2>Share {shareId}</h2>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            checkboxSelection
          />
        </Box>
      </Container>
    </>
  );
};
