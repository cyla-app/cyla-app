// package: 
// file: period-stats.proto

import * as jspb from "google-protobuf";

export class Period extends jspb.Message {
  getFrom(): string;
  setFrom(value: string): void;

  getTo(): string;
  setTo(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Period.AsObject;
  static toObject(includeInstance: boolean, msg: Period): Period.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Period, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Period;
  static deserializeBinaryFromReader(message: Period, reader: jspb.BinaryReader): Period;
}

export namespace Period {
  export type AsObject = {
    from: string,
    to: string,
  }
}

export class PeriodStats extends jspb.Message {
  clearPeriodsList(): void;
  getPeriodsList(): Array<Period>;
  setPeriodsList(value: Array<Period>): void;
  addPeriods(value?: Period, index?: number): Period;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeriodStats.AsObject;
  static toObject(includeInstance: boolean, msg: PeriodStats): PeriodStats.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PeriodStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeriodStats;
  static deserializeBinaryFromReader(message: PeriodStats, reader: jspb.BinaryReader): PeriodStats;
}

export namespace PeriodStats {
  export type AsObject = {
    periodsList: Array<Period.AsObject>,
  }
}

