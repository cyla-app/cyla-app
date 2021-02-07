import {
  Day as DayNamespace,
  Bleeding as BleedingNamespace,
  Mucus as MucusNamespace,
  Cervix as CervixNamespace,
  Temperature as TemperatureNamespace,
} from '../generated/day-info_pb'

import {
  Period as PeriodNamespace,
  PeriodStats as PeriodStatsNamespace,
} from '../generated/period-stats_pb'

export type Day = DayNamespace.AsObject
export type Bleeding = BleedingNamespace.AsObject
export const BleedingStrength = BleedingNamespace.Strength

export type Mucus = MucusNamespace.AsObject
export const MucusFeeling = MucusNamespace.Feeling
export const MucusTexture = MucusNamespace.Texture
export type Cervix = CervixNamespace.AsObject
export { ExcludeReason } from '../generated/day-info_pb'
export type Temperature = TemperatureNamespace.AsObject

export type Period = PeriodNamespace.AsObject
export type PeriodStats = PeriodStatsNamespace.AsObject
