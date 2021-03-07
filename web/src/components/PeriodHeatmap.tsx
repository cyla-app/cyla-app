import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "./PeriodHeatmap.css";
import { Bleeding_Strength, Day } from "../generated/day";
import { Paper, Tooltip } from "@material-ui/core";
import { getYear } from "date-fns";

const groupByYear = (array: Day[]) =>
  array.reduce((byYear: { [year: number]: Day[] }, day) => {
    const value = getYear(new Date(day.date));
    byYear[value] = (byYear[value] || []).concat(day);
    return byYear;
  }, {});

type PropsType = { days: Day[] };

export default ({ days }: PropsType) => {
  const byYear = groupByYear(days);

  return (
    <>
      {Object.entries(byYear).map(([year, days]) => {
        return (
          <>
            <div>{year}</div>
            <div style={{ height: 215 }}>
              <CalendarHeatmap
                startDate={new Date(days[0].date)}
                endDate={new Date(days[days.length - 1].date)}
                values={days.map((day) => ({
                  date: day.date,
                  count: day.bleeding
                    ? day.bleeding.strength === Bleeding_Strength.STRENGTH_WEAK
                      ? 1
                      : day.bleeding.strength ===
                        Bleeding_Strength.STRENGTH_MEDIUM
                      ? 2
                      : day.bleeding.strength ===
                        Bleeding_Strength.STRENGTH_STRONG
                      ? 3
                      : 0
                    : 0,
                }))}
                showWeekdayLabels={true}
                classForValue={(value) => {
                  if (!value) {
                    return "color-bleeding-0";
                  }
                  return `color-bleeding-${value.count}`;
                }}
                transformDayElement={(element, value) => {
                  if (!value) {
                    return React.cloneElement(element, { rx: 100, ry: 100 });
                  }
                  return (
                    <Tooltip title={value.date}>
                      {React.cloneElement(element, { rx: 100, ry: 100 })}
                    </Tooltip>
                  );
                }}
              />
            </div>
          </>
        );
      })}
    </>
  );
};
