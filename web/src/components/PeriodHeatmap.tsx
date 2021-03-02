import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "./PeriodHeatmap.css";
import { Bleeding_Strength, Day } from "../generated/day";
import { Tooltip } from "@material-ui/core";

type PropsType = { days: Day[] };

export default ({ days }: PropsType) => {
  return (
    <CalendarHeatmap
      startDate={new Date(days[0].date)}
      endDate={new Date(days[days.length - 1].date)}
      values={days.map((day) => ({
        date: day.date,
        count: day.bleeding
          ? day.bleeding.strength === Bleeding_Strength.STRENGTH_WEAK
            ? 1
            : day.bleeding.strength === Bleeding_Strength.STRENGTH_MEDIUM
            ? 2
            : day.bleeding.strength === Bleeding_Strength.STRENGTH_STRONG
            ? 3
            : 0
          : 0,
      }))}
      showWeekdayLabels={true}
      classForValue={(value) => {
        return `color-bleeding-${value.count}`;
      }}
      transformDayElement={(element, value) => (
        <Tooltip title={value.date}>
          {React.cloneElement(element, { rx: 100, ry: 100 })}
        </Tooltip>
      )}
    />
  );
};
