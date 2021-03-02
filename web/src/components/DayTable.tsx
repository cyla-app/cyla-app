import {
  Bleeding_Strength,
  Cervix_Firmness,
  Cervix_Opening,
  Cervix_Position,
  Day,
  Mucus_Feeling,
  Mucus_Texture,
} from "../generated/day";
import { DataGrid, ValueGetterParams } from "@material-ui/data-grid";
import React from "react";

const columns = [
  { field: "date", headerName: "Date", width: 120 },
  {
    field: "temperature_formatted",
    headerName: "Temperature",
    description: "Shows the body basal temperature",
    sortable: true,
    width: 150,
    valueGetter: (params: ValueGetterParams) => {
      const temperature = params.getValue("temperature") as number | undefined;
      return temperature ? `${Math.round(temperature * 100) / 100}°C` : "";
    },
  },
  {
    field: "bleeding",
    headerName: "Bleeding",
    width: 120,
  },
  {
    field: "cervix",
    headerName: "Cervix",
    width: 200,
  },
  {
    field: "mucus",
    headerName: "Mucus",
    width: 200,
  },
];
const mapCervixOpening = (opening: Cervix_Opening) => {
  return opening === Cervix_Opening.OPENING_RAISED
    ? "Raised"
    : opening === Cervix_Opening.OPENING_MEDIUM
    ? "Medium"
    : opening === Cervix_Opening.OPENING_CLOSED
    ? "Closed"
    : "";
};
const mapCervixPosition = (position: Cervix_Position) => {
  return position === Cervix_Position.POSITION_LOW
    ? "Low"
    : position === Cervix_Position.POSITION_CENTER
    ? "Center"
    : position === Cervix_Position.POSITION_HIGH
    ? "High"
    : "";
};
const mapCervixFirmness = (firmness: Cervix_Firmness) => {
  return firmness === Cervix_Firmness.FIRMNESS_SOFT
    ? "Soft"
    : firmness === Cervix_Firmness.FIRMNESS_MEDIUM
    ? "Medium"
    : firmness === Cervix_Firmness.FIRMNESS_FIRM
    ? "Firm"
    : "";
};
const mapMucusTexture = (texture: Mucus_Texture) => {
  return texture === Mucus_Texture.TEXTURE_EGG_WHITE
    ? "Egg White"
    : texture === Mucus_Texture.TEXTURE_CREAMY
    ? "Creamy"
    : "";
};
const mapMucusFeeling = (feeling: Mucus_Feeling) => {
  return feeling === Mucus_Feeling.FEELING_WET
    ? "Weg"
    : feeling === Mucus_Feeling.FEELING_SLIPPERY
    ? "Slippery"
    : feeling === Mucus_Feeling.FEELING_DRY
    ? "Dry"
    : "";
};
const mapBleedingStrength = (bleeding: Bleeding_Strength) => {
  return bleeding === Bleeding_Strength.STRENGTH_WEAK
    ? "Weak"
    : bleeding === Bleeding_Strength.STRENGTH_MEDIUM
    ? "Medium"
    : bleeding === Bleeding_Strength.STRENGTH_STRONG
    ? "Strong"
    : "";
};

type PropsType = { days: Day[] };

export default ({ days }: PropsType) => {
  return (
    <DataGrid
      autoHeight={true}
      rows={days.map((day, i) => ({
        id: i,
        date: day.date,
        bleeding: day.bleeding
          ? mapBleedingStrength(day.bleeding.strength)
          : "",
        cervix: day.cervix
          ? `${mapCervixOpening(day.cervix.opening)}, ${mapCervixPosition(
              day.cervix.position
            )}, ${mapCervixFirmness(day.cervix.firmness)}`
          : "",
        mucus: day.mucus
          ? `${mapMucusTexture(day.mucus.texture)}, ${mapMucusFeeling(
              day.mucus.feeling
            )}`
          : "",
        temperature: day.temperature?.value,
      }))}
      columns={columns}
      pageSize={10}
    />
  );
};
