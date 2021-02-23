import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DayService,
  OpenAPI,
  ShareDayService,
  ShareService,
} from "../generated/openapi";
import { Day } from "../generated/day";
import * as themis from "../themis";
// @ts-ignore
import themisWasm from "../themis/libthemis.wasm";
import { DataGrid, ValueGetterParams } from "@material-ui/data-grid";
import { Box, Container } from "@material-ui/core";

new DayService();
console.log(Day.toJSON({ date: "sdf" }));
themis.initialize(themisWasm).then(function () {
  let cell = themis.SecureCellSeal.withPassphrase("sdf");
  const encrypted = cell.encrypt(new TextEncoder().encode("Hello World"));
  console.log(new TextDecoder().decode(cell.decrypt(encrypted)));
});

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

export default () => {
  let { shareId } = useParams();

  useEffect(() => {
    const load = async () => {
      OpenAPI.BASE = "http://localhost:5000";
      const shares = await ShareService.shareAuth("shareId", {
        hashedPwd: "sdf",
      });
      console.log(shares);
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
