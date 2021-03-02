import { Bleeding_Strength, Day } from "../generated/day";
import { DataGrid, ValueGetterParams } from "@material-ui/data-grid";
import React from "react";

const columns = [
  { field: "date", headerName: "Date", width: 130 },
  { field: "bleeding", headerName: "Bleeding", width: 300 },
  {
    field: "temperature_formatted",
    headerName: "Temperature",
    description: "Shows the body basal temperature",
    sortable: true,
    width: 160,
    valueGetter: (params: ValueGetterParams) => {
      const temperature: number = params.getValue("temperature") as number;
      return `${Math.round(temperature * 100) / 100}°C`;
    },
  },
];

type PropsType = { days: Day[] };

export default ({ days }: PropsType) => {
  return (
    <DataGrid
      autoHeight={true}
      rows={days.map((day, i) => ({
        id: i,
        date: day.date,
        bleeding:
          Bleeding_Strength[
            day.bleeding?.strength ?? Bleeding_Strength.STRENGTH_NONE
          ],
        temperature: day.temperature?.value,
      }))}
      columns={columns}
      pageSize={10}
    />
  );
};
