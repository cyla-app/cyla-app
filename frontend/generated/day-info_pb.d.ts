// package: 
// file: day-info.proto

import * as jspb from "google-protobuf";

export class Bleeding extends jspb.Message {
  getStrength(): Bleeding.StrengthMap[keyof Bleeding.StrengthMap];
  setStrength(value: Bleeding.StrengthMap[keyof Bleeding.StrengthMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Bleeding.AsObject;
  static toObject(includeInstance: boolean, msg: Bleeding): Bleeding.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Bleeding, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Bleeding;
  static deserializeBinaryFromReader(message: Bleeding, reader: jspb.BinaryReader): Bleeding;
}

export namespace Bleeding {
  export type AsObject = {
    strength: Bleeding.StrengthMap[keyof Bleeding.StrengthMap],
  }

  export interface StrengthMap {
    STRENGTH_NONE: 0;
    STRENGTH_WEAK: 1;
    STRENGTH_MEDIUM: 2;
    STRENGTH_STRONG: 3;
  }

  export const Strength: StrengthMap;
}

export class Temperature extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getNote(): string;
  setNote(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Temperature.AsObject;
  static toObject(includeInstance: boolean, msg: Temperature): Temperature.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Temperature, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Temperature;
  static deserializeBinaryFromReader(message: Temperature, reader: jspb.BinaryReader): Temperature;
}

export namespace Temperature {
  export type AsObject = {
    value: number,
    timestamp: string,
    note: string,
  }
}

export class Mucus extends jspb.Message {
  getFeeling(): Mucus.FeelingMap[keyof Mucus.FeelingMap];
  setFeeling(value: Mucus.FeelingMap[keyof Mucus.FeelingMap]): void;

  getTexture(): Mucus.TextureMap[keyof Mucus.TextureMap];
  setTexture(value: Mucus.TextureMap[keyof Mucus.TextureMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Mucus.AsObject;
  static toObject(includeInstance: boolean, msg: Mucus): Mucus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Mucus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Mucus;
  static deserializeBinaryFromReader(message: Mucus, reader: jspb.BinaryReader): Mucus;
}

export namespace Mucus {
  export type AsObject = {
    feeling: Mucus.FeelingMap[keyof Mucus.FeelingMap],
    texture: Mucus.TextureMap[keyof Mucus.TextureMap],
  }

  export interface FeelingMap {
    FEELING_NONE: 0;
    FEELING_DRY: 1;
    FEELING_WET: 2;
    FEELING_SLIPPERY: 3;
  }

  export const Feeling: FeelingMap;

  export interface TextureMap {
    TEXTURE_NONE: 0;
    TEXTURE_CREAMY: 1;
    TEXTURE_EGG_WHITE: 2;
  }

  export const Texture: TextureMap;
}

export class Cervix extends jspb.Message {
  getOpening(): Cervix.OpeningMap[keyof Cervix.OpeningMap];
  setOpening(value: Cervix.OpeningMap[keyof Cervix.OpeningMap]): void;

  getFirmness(): Cervix.FirmnessMap[keyof Cervix.FirmnessMap];
  setFirmness(value: Cervix.FirmnessMap[keyof Cervix.FirmnessMap]): void;

  getPosition(): Cervix.PositionMap[keyof Cervix.PositionMap];
  setPosition(value: Cervix.PositionMap[keyof Cervix.PositionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Cervix.AsObject;
  static toObject(includeInstance: boolean, msg: Cervix): Cervix.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Cervix, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Cervix;
  static deserializeBinaryFromReader(message: Cervix, reader: jspb.BinaryReader): Cervix;
}

export namespace Cervix {
  export type AsObject = {
    opening: Cervix.OpeningMap[keyof Cervix.OpeningMap],
    firmness: Cervix.FirmnessMap[keyof Cervix.FirmnessMap],
    position: Cervix.PositionMap[keyof Cervix.PositionMap],
  }

  export interface OpeningMap {
    OPENING_NONE: 0;
    OPENING_CLOSED: 1;
    OPENING_MEDIUM: 2;
    OPENING_RAISED: 3;
  }

  export const Opening: OpeningMap;

  export interface FirmnessMap {
    FIRMNESS_NONE: 0;
    FIRMNESS_FIRM: 1;
    FIRMNESS_MEDIUM: 2;
    FIRMNESS_SOFT: 3;
  }

  export const Firmness: FirmnessMap;

  export interface PositionMap {
    POSITION_NONE: 0;
    POSITION_LOW: 1;
    POSITION_CENTER: 2;
    POSITION_HIGH: 3;
  }

  export const Position: PositionMap;
}

export class Day extends jspb.Message {
  getDate(): string;
  setDate(value: string): void;

  getExcludeReason(): ExcludeReasonMap[keyof ExcludeReasonMap];
  setExcludeReason(value: ExcludeReasonMap[keyof ExcludeReasonMap]): void;

  hasTemperature(): boolean;
  clearTemperature(): void;
  getTemperature(): Temperature | undefined;
  setTemperature(value?: Temperature): void;

  hasBleeding(): boolean;
  clearBleeding(): void;
  getBleeding(): Bleeding | undefined;
  setBleeding(value?: Bleeding): void;

  hasMucus(): boolean;
  clearMucus(): void;
  getMucus(): Mucus | undefined;
  setMucus(value?: Mucus): void;

  hasCervix(): boolean;
  clearCervix(): void;
  getCervix(): Cervix | undefined;
  setCervix(value?: Cervix): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Day.AsObject;
  static toObject(includeInstance: boolean, msg: Day): Day.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Day, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Day;
  static deserializeBinaryFromReader(message: Day, reader: jspb.BinaryReader): Day;
}

export namespace Day {
  export type AsObject = {
    date: string,
    excludeReason: ExcludeReasonMap[keyof ExcludeReasonMap],
    temperature?: Temperature.AsObject,
    bleeding?: Bleeding.AsObject,
    mucus?: Mucus.AsObject,
    cervix?: Cervix.AsObject,
  }
}

export interface ExcludeReasonMap {
  EXCLUDE_REASON_NONE: 0;
  EXCLUDE_REASON_SICK: 1;
  EXCLUDE_REASON_HUNGOVER: 2;
  EXCLUDE_REASON_SLEEP: 3;
}

export const ExcludeReason: ExcludeReasonMap;

