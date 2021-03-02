import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import React from "react";
import { Day } from "../generated/day";

type PropsType = { days: Day[] };

export default ({ days }: PropsType) => {
  return (
    <LineChart
      width={1000}
      height={300}
      data={days.map((day, i) => ({
        date: day.date,
        value: Math.round(day.temperature?.value!! * 100) / 100,
      }))}
    >
      <XAxis
        angle={-45}
        textAnchor="end"
        dataKey="date"
        tickFormatter={(date) => {
          if (date === "auto") {
            return date;
          }
          return format(new Date(date), "dd-MM-yyyy");
        }}
      />
      <YAxis domain={[36, 38]} />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
};
