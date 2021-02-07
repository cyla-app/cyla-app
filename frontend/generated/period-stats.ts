/* eslint-disable */
import { Writer, Reader } from 'protobufjs/minimal'

export const protobufPackage = ''

export interface Period {
  from: string
  to: string
}

export interface PeriodStats {
  periods: Period[]
}

const basePeriod: object = { from: '', to: '' }

export const Period = {
  encode(message: Period, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.from)
    writer.uint32(18).string(message.to)
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Period {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...basePeriod } as Period
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string()
          break
        case 2:
          message.to = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Period {
    const message = { ...basePeriod } as Period
    if (object.from !== undefined && object.from !== null) {
      message.from = String(object.from)
    } else {
      message.from = ''
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = String(object.to)
    } else {
      message.to = ''
    }
    return message
  },

  fromPartial(object: DeepPartial<Period>): Period {
    const message = { ...basePeriod } as Period
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from
    } else {
      message.from = ''
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = object.to
    } else {
      message.to = ''
    }
    return message
  },

  toJSON(message: Period): unknown {
    const obj: any = {}
    message.from !== undefined && (obj.from = message.from)
    message.to !== undefined && (obj.to = message.to)
    return obj
  },
}

const basePeriodStats: object = {}

export const PeriodStats = {
  encode(message: PeriodStats, writer: Writer = Writer.create()): Writer {
    for (const v of message.periods) {
      Period.encode(v!, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): PeriodStats {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...basePeriodStats } as PeriodStats
    message.periods = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.periods.push(Period.decode(reader, reader.uint32()))
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PeriodStats {
    const message = { ...basePeriodStats } as PeriodStats
    message.periods = []
    if (object.periods !== undefined && object.periods !== null) {
      for (const e of object.periods) {
        message.periods.push(Period.fromJSON(e))
      }
    }
    return message
  },

  fromPartial(object: DeepPartial<PeriodStats>): PeriodStats {
    const message = { ...basePeriodStats } as PeriodStats
    message.periods = []
    if (object.periods !== undefined && object.periods !== null) {
      for (const e of object.periods) {
        message.periods.push(Period.fromPartial(e))
      }
    }
    return message
  },

  toJSON(message: PeriodStats): unknown {
    const obj: any = {}
    if (message.periods) {
      obj.periods = message.periods.map((e) =>
        e ? Period.toJSON(e) : undefined,
      )
    } else {
      obj.periods = []
    }
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
