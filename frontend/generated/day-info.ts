/* eslint-disable */
import { Writer, Reader } from 'protobufjs/minimal'

export const protobufPackage = ''

export enum ExcludeReason {
  EXCLUDE_REASON_NONE = 0,
  EXCLUDE_REASON_SICK = 1,
  EXCLUDE_REASON_HUNGOVER = 2,
  EXCLUDE_REASON_SLEEP = 3,
  UNRECOGNIZED = -1,
}

export function excludeReasonFromJSON(object: any): ExcludeReason {
  switch (object) {
    case 0:
    case 'EXCLUDE_REASON_NONE':
      return ExcludeReason.EXCLUDE_REASON_NONE
    case 1:
    case 'EXCLUDE_REASON_SICK':
      return ExcludeReason.EXCLUDE_REASON_SICK
    case 2:
    case 'EXCLUDE_REASON_HUNGOVER':
      return ExcludeReason.EXCLUDE_REASON_HUNGOVER
    case 3:
    case 'EXCLUDE_REASON_SLEEP':
      return ExcludeReason.EXCLUDE_REASON_SLEEP
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ExcludeReason.UNRECOGNIZED
  }
}

export function excludeReasonToJSON(object: ExcludeReason): string {
  switch (object) {
    case ExcludeReason.EXCLUDE_REASON_NONE:
      return 'EXCLUDE_REASON_NONE'
    case ExcludeReason.EXCLUDE_REASON_SICK:
      return 'EXCLUDE_REASON_SICK'
    case ExcludeReason.EXCLUDE_REASON_HUNGOVER:
      return 'EXCLUDE_REASON_HUNGOVER'
    case ExcludeReason.EXCLUDE_REASON_SLEEP:
      return 'EXCLUDE_REASON_SLEEP'
    default:
      return 'UNKNOWN'
  }
}

export interface Bleeding {
  strength: Bleeding_Strength
}

export enum Bleeding_Strength {
  STRENGTH_NONE = 0,
  STRENGTH_WEAK = 1,
  STRENGTH_MEDIUM = 2,
  STRENGTH_STRONG = 3,
  UNRECOGNIZED = -1,
}

export function bleeding_StrengthFromJSON(object: any): Bleeding_Strength {
  switch (object) {
    case 0:
    case 'STRENGTH_NONE':
      return Bleeding_Strength.STRENGTH_NONE
    case 1:
    case 'STRENGTH_WEAK':
      return Bleeding_Strength.STRENGTH_WEAK
    case 2:
    case 'STRENGTH_MEDIUM':
      return Bleeding_Strength.STRENGTH_MEDIUM
    case 3:
    case 'STRENGTH_STRONG':
      return Bleeding_Strength.STRENGTH_STRONG
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Bleeding_Strength.UNRECOGNIZED
  }
}

export function bleeding_StrengthToJSON(object: Bleeding_Strength): string {
  switch (object) {
    case Bleeding_Strength.STRENGTH_NONE:
      return 'STRENGTH_NONE'
    case Bleeding_Strength.STRENGTH_WEAK:
      return 'STRENGTH_WEAK'
    case Bleeding_Strength.STRENGTH_MEDIUM:
      return 'STRENGTH_MEDIUM'
    case Bleeding_Strength.STRENGTH_STRONG:
      return 'STRENGTH_STRONG'
    default:
      return 'UNKNOWN'
  }
}

export interface Temperature {
  value: number
  timestamp: string
  note: string
}

export interface Mucus {
  feeling: Mucus_Feeling
  texture: Mucus_Texture
}

export enum Mucus_Feeling {
  FEELING_NONE = 0,
  FEELING_DRY = 1,
  FEELING_WET = 2,
  FEELING_SLIPPERY = 3,
  UNRECOGNIZED = -1,
}

export function mucus_FeelingFromJSON(object: any): Mucus_Feeling {
  switch (object) {
    case 0:
    case 'FEELING_NONE':
      return Mucus_Feeling.FEELING_NONE
    case 1:
    case 'FEELING_DRY':
      return Mucus_Feeling.FEELING_DRY
    case 2:
    case 'FEELING_WET':
      return Mucus_Feeling.FEELING_WET
    case 3:
    case 'FEELING_SLIPPERY':
      return Mucus_Feeling.FEELING_SLIPPERY
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Mucus_Feeling.UNRECOGNIZED
  }
}

export function mucus_FeelingToJSON(object: Mucus_Feeling): string {
  switch (object) {
    case Mucus_Feeling.FEELING_NONE:
      return 'FEELING_NONE'
    case Mucus_Feeling.FEELING_DRY:
      return 'FEELING_DRY'
    case Mucus_Feeling.FEELING_WET:
      return 'FEELING_WET'
    case Mucus_Feeling.FEELING_SLIPPERY:
      return 'FEELING_SLIPPERY'
    default:
      return 'UNKNOWN'
  }
}

export enum Mucus_Texture {
  TEXTURE_NONE = 0,
  TEXTURE_CREAMY = 1,
  TEXTURE_EGG_WHITE = 2,
  UNRECOGNIZED = -1,
}

export function mucus_TextureFromJSON(object: any): Mucus_Texture {
  switch (object) {
    case 0:
    case 'TEXTURE_NONE':
      return Mucus_Texture.TEXTURE_NONE
    case 1:
    case 'TEXTURE_CREAMY':
      return Mucus_Texture.TEXTURE_CREAMY
    case 2:
    case 'TEXTURE_EGG_WHITE':
      return Mucus_Texture.TEXTURE_EGG_WHITE
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Mucus_Texture.UNRECOGNIZED
  }
}

export function mucus_TextureToJSON(object: Mucus_Texture): string {
  switch (object) {
    case Mucus_Texture.TEXTURE_NONE:
      return 'TEXTURE_NONE'
    case Mucus_Texture.TEXTURE_CREAMY:
      return 'TEXTURE_CREAMY'
    case Mucus_Texture.TEXTURE_EGG_WHITE:
      return 'TEXTURE_EGG_WHITE'
    default:
      return 'UNKNOWN'
  }
}

export interface Cervix {
  opening: Cervix_Opening
  firmness: Cervix_Firmness
  position: Cervix_Position
}

export enum Cervix_Opening {
  OPENING_NONE = 0,
  OPENING_CLOSED = 1,
  OPENING_MEDIUM = 2,
  OPENING_RAISED = 3,
  UNRECOGNIZED = -1,
}

export function cervix_OpeningFromJSON(object: any): Cervix_Opening {
  switch (object) {
    case 0:
    case 'OPENING_NONE':
      return Cervix_Opening.OPENING_NONE
    case 1:
    case 'OPENING_CLOSED':
      return Cervix_Opening.OPENING_CLOSED
    case 2:
    case 'OPENING_MEDIUM':
      return Cervix_Opening.OPENING_MEDIUM
    case 3:
    case 'OPENING_RAISED':
      return Cervix_Opening.OPENING_RAISED
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Cervix_Opening.UNRECOGNIZED
  }
}

export function cervix_OpeningToJSON(object: Cervix_Opening): string {
  switch (object) {
    case Cervix_Opening.OPENING_NONE:
      return 'OPENING_NONE'
    case Cervix_Opening.OPENING_CLOSED:
      return 'OPENING_CLOSED'
    case Cervix_Opening.OPENING_MEDIUM:
      return 'OPENING_MEDIUM'
    case Cervix_Opening.OPENING_RAISED:
      return 'OPENING_RAISED'
    default:
      return 'UNKNOWN'
  }
}

export enum Cervix_Firmness {
  FIRMNESS_NONE = 0,
  FIRMNESS_FIRM = 1,
  FIRMNESS_MEDIUM = 2,
  FIRMNESS_SOFT = 3,
  UNRECOGNIZED = -1,
}

export function cervix_FirmnessFromJSON(object: any): Cervix_Firmness {
  switch (object) {
    case 0:
    case 'FIRMNESS_NONE':
      return Cervix_Firmness.FIRMNESS_NONE
    case 1:
    case 'FIRMNESS_FIRM':
      return Cervix_Firmness.FIRMNESS_FIRM
    case 2:
    case 'FIRMNESS_MEDIUM':
      return Cervix_Firmness.FIRMNESS_MEDIUM
    case 3:
    case 'FIRMNESS_SOFT':
      return Cervix_Firmness.FIRMNESS_SOFT
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Cervix_Firmness.UNRECOGNIZED
  }
}

export function cervix_FirmnessToJSON(object: Cervix_Firmness): string {
  switch (object) {
    case Cervix_Firmness.FIRMNESS_NONE:
      return 'FIRMNESS_NONE'
    case Cervix_Firmness.FIRMNESS_FIRM:
      return 'FIRMNESS_FIRM'
    case Cervix_Firmness.FIRMNESS_MEDIUM:
      return 'FIRMNESS_MEDIUM'
    case Cervix_Firmness.FIRMNESS_SOFT:
      return 'FIRMNESS_SOFT'
    default:
      return 'UNKNOWN'
  }
}

export enum Cervix_Position {
  POSITION_NONE = 0,
  POSITION_LOW = 1,
  POSITION_CENTER = 2,
  POSITION_HIGH = 3,
  UNRECOGNIZED = -1,
}

export function cervix_PositionFromJSON(object: any): Cervix_Position {
  switch (object) {
    case 0:
    case 'POSITION_NONE':
      return Cervix_Position.POSITION_NONE
    case 1:
    case 'POSITION_LOW':
      return Cervix_Position.POSITION_LOW
    case 2:
    case 'POSITION_CENTER':
      return Cervix_Position.POSITION_CENTER
    case 3:
    case 'POSITION_HIGH':
      return Cervix_Position.POSITION_HIGH
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Cervix_Position.UNRECOGNIZED
  }
}

export function cervix_PositionToJSON(object: Cervix_Position): string {
  switch (object) {
    case Cervix_Position.POSITION_NONE:
      return 'POSITION_NONE'
    case Cervix_Position.POSITION_LOW:
      return 'POSITION_LOW'
    case Cervix_Position.POSITION_CENTER:
      return 'POSITION_CENTER'
    case Cervix_Position.POSITION_HIGH:
      return 'POSITION_HIGH'
    default:
      return 'UNKNOWN'
  }
}

export interface Day {
  date: string
  excludeReason: ExcludeReason
  temperature: Temperature | undefined
  bleeding: Bleeding | undefined
  mucus: Mucus | undefined
  cervix: Cervix | undefined
}

const baseBleeding: object = { strength: 0 }

export const Bleeding = {
  encode(message: Bleeding, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).int32(message.strength)
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Bleeding {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseBleeding } as Bleeding
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.strength = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Bleeding {
    const message = { ...baseBleeding } as Bleeding
    if (object.strength !== undefined && object.strength !== null) {
      message.strength = bleeding_StrengthFromJSON(object.strength)
    } else {
      message.strength = 0
    }
    return message
  },

  fromPartial(object: DeepPartial<Bleeding>): Bleeding {
    const message = { ...baseBleeding } as Bleeding
    if (object.strength !== undefined && object.strength !== null) {
      message.strength = object.strength
    } else {
      message.strength = 0
    }
    return message
  },

  toJSON(message: Bleeding): unknown {
    const obj: any = {}
    message.strength !== undefined &&
      (obj.strength = bleeding_StrengthToJSON(message.strength))
    return obj
  },
}

const baseTemperature: object = { value: 0, timestamp: '', note: '' }

export const Temperature = {
  encode(message: Temperature, writer: Writer = Writer.create()): Writer {
    writer.uint32(13).float(message.value)
    writer.uint32(18).string(message.timestamp)
    writer.uint32(26).string(message.note)
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Temperature {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseTemperature } as Temperature
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.value = reader.float()
          break
        case 2:
          message.timestamp = reader.string()
          break
        case 3:
          message.note = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Temperature {
    const message = { ...baseTemperature } as Temperature
    if (object.value !== undefined && object.value !== null) {
      message.value = Number(object.value)
    } else {
      message.value = 0
    }
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = String(object.timestamp)
    } else {
      message.timestamp = ''
    }
    if (object.note !== undefined && object.note !== null) {
      message.note = String(object.note)
    } else {
      message.note = ''
    }
    return message
  },

  fromPartial(object: DeepPartial<Temperature>): Temperature {
    const message = { ...baseTemperature } as Temperature
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value
    } else {
      message.value = 0
    }
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = object.timestamp
    } else {
      message.timestamp = ''
    }
    if (object.note !== undefined && object.note !== null) {
      message.note = object.note
    } else {
      message.note = ''
    }
    return message
  },

  toJSON(message: Temperature): unknown {
    const obj: any = {}
    message.value !== undefined && (obj.value = message.value)
    message.timestamp !== undefined && (obj.timestamp = message.timestamp)
    message.note !== undefined && (obj.note = message.note)
    return obj
  },
}

const baseMucus: object = { feeling: 0, texture: 0 }

export const Mucus = {
  encode(message: Mucus, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).int32(message.feeling)
    writer.uint32(16).int32(message.texture)
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Mucus {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMucus } as Mucus
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.feeling = reader.int32() as any
          break
        case 2:
          message.texture = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Mucus {
    const message = { ...baseMucus } as Mucus
    if (object.feeling !== undefined && object.feeling !== null) {
      message.feeling = mucus_FeelingFromJSON(object.feeling)
    } else {
      message.feeling = 0
    }
    if (object.texture !== undefined && object.texture !== null) {
      message.texture = mucus_TextureFromJSON(object.texture)
    } else {
      message.texture = 0
    }
    return message
  },

  fromPartial(object: DeepPartial<Mucus>): Mucus {
    const message = { ...baseMucus } as Mucus
    if (object.feeling !== undefined && object.feeling !== null) {
      message.feeling = object.feeling
    } else {
      message.feeling = 0
    }
    if (object.texture !== undefined && object.texture !== null) {
      message.texture = object.texture
    } else {
      message.texture = 0
    }
    return message
  },

  toJSON(message: Mucus): unknown {
    const obj: any = {}
    message.feeling !== undefined &&
      (obj.feeling = mucus_FeelingToJSON(message.feeling))
    message.texture !== undefined &&
      (obj.texture = mucus_TextureToJSON(message.texture))
    return obj
  },
}

const baseCervix: object = { opening: 0, firmness: 0, position: 0 }

export const Cervix = {
  encode(message: Cervix, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).int32(message.opening)
    writer.uint32(16).int32(message.firmness)
    writer.uint32(24).int32(message.position)
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Cervix {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseCervix } as Cervix
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.opening = reader.int32() as any
          break
        case 2:
          message.firmness = reader.int32() as any
          break
        case 3:
          message.position = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Cervix {
    const message = { ...baseCervix } as Cervix
    if (object.opening !== undefined && object.opening !== null) {
      message.opening = cervix_OpeningFromJSON(object.opening)
    } else {
      message.opening = 0
    }
    if (object.firmness !== undefined && object.firmness !== null) {
      message.firmness = cervix_FirmnessFromJSON(object.firmness)
    } else {
      message.firmness = 0
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = cervix_PositionFromJSON(object.position)
    } else {
      message.position = 0
    }
    return message
  },

  fromPartial(object: DeepPartial<Cervix>): Cervix {
    const message = { ...baseCervix } as Cervix
    if (object.opening !== undefined && object.opening !== null) {
      message.opening = object.opening
    } else {
      message.opening = 0
    }
    if (object.firmness !== undefined && object.firmness !== null) {
      message.firmness = object.firmness
    } else {
      message.firmness = 0
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = object.position
    } else {
      message.position = 0
    }
    return message
  },

  toJSON(message: Cervix): unknown {
    const obj: any = {}
    message.opening !== undefined &&
      (obj.opening = cervix_OpeningToJSON(message.opening))
    message.firmness !== undefined &&
      (obj.firmness = cervix_FirmnessToJSON(message.firmness))
    message.position !== undefined &&
      (obj.position = cervix_PositionToJSON(message.position))
    return obj
  },
}

const baseDay: object = { date: '', excludeReason: 0 }

export const Day = {
  encode(message: Day, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.date)
    writer.uint32(80).int32(message.excludeReason)
    if (
      message.temperature !== undefined &&
      message.temperature !== undefined
    ) {
      Temperature.encode(message.temperature, writer.uint32(98).fork()).ldelim()
    }
    if (message.bleeding !== undefined && message.bleeding !== undefined) {
      Bleeding.encode(message.bleeding, writer.uint32(106).fork()).ldelim()
    }
    if (message.mucus !== undefined && message.mucus !== undefined) {
      Mucus.encode(message.mucus, writer.uint32(114).fork()).ldelim()
    }
    if (message.cervix !== undefined && message.cervix !== undefined) {
      Cervix.encode(message.cervix, writer.uint32(122).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Day {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseDay } as Day
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.date = reader.string()
          break
        case 10:
          message.excludeReason = reader.int32() as any
          break
        case 12:
          message.temperature = Temperature.decode(reader, reader.uint32())
          break
        case 13:
          message.bleeding = Bleeding.decode(reader, reader.uint32())
          break
        case 14:
          message.mucus = Mucus.decode(reader, reader.uint32())
          break
        case 15:
          message.cervix = Cervix.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Day {
    const message = { ...baseDay } as Day
    if (object.date !== undefined && object.date !== null) {
      message.date = String(object.date)
    } else {
      message.date = ''
    }
    if (object.excludeReason !== undefined && object.excludeReason !== null) {
      message.excludeReason = excludeReasonFromJSON(object.excludeReason)
    } else {
      message.excludeReason = 0
    }
    if (object.temperature !== undefined && object.temperature !== null) {
      message.temperature = Temperature.fromJSON(object.temperature)
    } else {
      message.temperature = undefined
    }
    if (object.bleeding !== undefined && object.bleeding !== null) {
      message.bleeding = Bleeding.fromJSON(object.bleeding)
    } else {
      message.bleeding = undefined
    }
    if (object.mucus !== undefined && object.mucus !== null) {
      message.mucus = Mucus.fromJSON(object.mucus)
    } else {
      message.mucus = undefined
    }
    if (object.cervix !== undefined && object.cervix !== null) {
      message.cervix = Cervix.fromJSON(object.cervix)
    } else {
      message.cervix = undefined
    }
    return message
  },

  fromPartial(object: DeepPartial<Day>): Day {
    const message = { ...baseDay } as Day
    if (object.date !== undefined && object.date !== null) {
      message.date = object.date
    } else {
      message.date = ''
    }
    if (object.excludeReason !== undefined && object.excludeReason !== null) {
      message.excludeReason = object.excludeReason
    } else {
      message.excludeReason = 0
    }
    if (object.temperature !== undefined && object.temperature !== null) {
      message.temperature = Temperature.fromPartial(object.temperature)
    } else {
      message.temperature = undefined
    }
    if (object.bleeding !== undefined && object.bleeding !== null) {
      message.bleeding = Bleeding.fromPartial(object.bleeding)
    } else {
      message.bleeding = undefined
    }
    if (object.mucus !== undefined && object.mucus !== null) {
      message.mucus = Mucus.fromPartial(object.mucus)
    } else {
      message.mucus = undefined
    }
    if (object.cervix !== undefined && object.cervix !== null) {
      message.cervix = Cervix.fromPartial(object.cervix)
    } else {
      message.cervix = undefined
    }
    return message
  },

  toJSON(message: Day): unknown {
    const obj: any = {}
    message.date !== undefined && (obj.date = message.date)
    message.excludeReason !== undefined &&
      (obj.excludeReason = excludeReasonToJSON(message.excludeReason))
    message.temperature !== undefined &&
      (obj.temperature = message.temperature
        ? Temperature.toJSON(message.temperature)
        : undefined)
    message.bleeding !== undefined &&
      (obj.bleeding = message.bleeding
        ? Bleeding.toJSON(message.bleeding)
        : undefined)
    message.mucus !== undefined &&
      (obj.mucus = message.mucus ? Mucus.toJSON(message.mucus) : undefined)
    message.cervix !== undefined &&
      (obj.cervix = message.cervix ? Cervix.toJSON(message.cervix) : undefined)
    return obj
  },
}

type Builtin = Date | Function | Uint8Array | string | number | undefined
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>
