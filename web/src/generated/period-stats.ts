/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export interface Period {
  from: string;
  to: string;
}

export interface PeriodStats {
  periods: Period[];
}

export interface PeriodStatsDTO {
  periodStats?: PeriodStats;
  padding: string;
}

const basePeriod: object = { from: "", to: "" };

export const Period = {
  encode(
    message: Period,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(18).string(message.to);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Period {
    const reader = input instanceof Uint8Array ? new _m0.Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = globalThis.Object.create(basePeriod) as Period;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.to = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Period {
    const message = globalThis.Object.create(basePeriod) as Period;
    if (object.from !== undefined && object.from !== null) {
      message.from = String(object.from);
    } else {
      message.from = "";
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = String(object.to);
    } else {
      message.to = "";
    }
    return message;
  },

  fromPartial(object: DeepPartial<Period>): Period {
    const message = { ...basePeriod } as Period;
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from;
    } else {
      message.from = "";
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = object.to;
    } else {
      message.to = "";
    }
    return message;
  },

  toJSON(message: Period): unknown {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    return obj;
  },
};

const basePeriodStats: object = {};

export const PeriodStats = {
  encode(
    message: PeriodStats,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.periods) {
      Period.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PeriodStats {
    const reader = input instanceof Uint8Array ? new _m0.Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = globalThis.Object.create(basePeriodStats) as PeriodStats;
    message.periods = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.periods.push(Period.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PeriodStats {
    const message = globalThis.Object.create(basePeriodStats) as PeriodStats;
    message.periods = [];
    if (object.periods !== undefined && object.periods !== null) {
      for (const e of object.periods) {
        message.periods.push(Period.fromJSON(e));
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<PeriodStats>): PeriodStats {
    const message = { ...basePeriodStats } as PeriodStats;
    message.periods = [];
    if (object.periods !== undefined && object.periods !== null) {
      for (const e of object.periods) {
        message.periods.push(Period.fromPartial(e));
      }
    }
    return message;
  },

  toJSON(message: PeriodStats): unknown {
    const obj: any = {};
    if (message.periods) {
      obj.periods = message.periods.map((e) =>
        e ? Period.toJSON(e) : undefined
      );
    } else {
      obj.periods = [];
    }
    return obj;
  },
};

const basePeriodStatsDTO: object = { padding: "" };

export const PeriodStatsDTO = {
  encode(
    message: PeriodStatsDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.periodStats !== undefined) {
      PeriodStats.encode(
        message.periodStats,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.padding !== "") {
      writer.uint32(18).string(message.padding);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PeriodStatsDTO {
    const reader = input instanceof Uint8Array ? new _m0.Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = globalThis.Object.create(
      basePeriodStatsDTO
    ) as PeriodStatsDTO;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.periodStats = PeriodStats.decode(reader, reader.uint32());
          break;
        case 2:
          message.padding = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PeriodStatsDTO {
    const message = globalThis.Object.create(
      basePeriodStatsDTO
    ) as PeriodStatsDTO;
    if (object.periodStats !== undefined && object.periodStats !== null) {
      message.periodStats = PeriodStats.fromJSON(object.periodStats);
    } else {
      message.periodStats = undefined;
    }
    if (object.padding !== undefined && object.padding !== null) {
      message.padding = String(object.padding);
    } else {
      message.padding = "";
    }
    return message;
  },

  fromPartial(object: DeepPartial<PeriodStatsDTO>): PeriodStatsDTO {
    const message = { ...basePeriodStatsDTO } as PeriodStatsDTO;
    if (object.periodStats !== undefined && object.periodStats !== null) {
      message.periodStats = PeriodStats.fromPartial(object.periodStats);
    } else {
      message.periodStats = undefined;
    }
    if (object.padding !== undefined && object.padding !== null) {
      message.padding = object.padding;
    } else {
      message.padding = "";
    }
    return message;
  },

  toJSON(message: PeriodStatsDTO): unknown {
    const obj: any = {};
    message.periodStats !== undefined &&
      (obj.periodStats = message.periodStats
        ? PeriodStats.toJSON(message.periodStats)
        : undefined);
    message.padding !== undefined && (obj.padding = message.padding);
    return obj;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
