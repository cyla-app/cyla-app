// source: day-info.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.Bleeding', null, global);
goog.exportSymbol('proto.Bleeding.Strength', null, global);
goog.exportSymbol('proto.Cervix', null, global);
goog.exportSymbol('proto.Cervix.Firmness', null, global);
goog.exportSymbol('proto.Cervix.Opening', null, global);
goog.exportSymbol('proto.Cervix.Position', null, global);
goog.exportSymbol('proto.Day', null, global);
goog.exportSymbol('proto.ExcludeReason', null, global);
goog.exportSymbol('proto.Mucus', null, global);
goog.exportSymbol('proto.Mucus.Feeling', null, global);
goog.exportSymbol('proto.Mucus.Texture', null, global);
goog.exportSymbol('proto.Temperature', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Bleeding = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Bleeding, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Bleeding.displayName = 'proto.Bleeding';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Temperature = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Temperature, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Temperature.displayName = 'proto.Temperature';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Mucus = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Mucus, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Mucus.displayName = 'proto.Mucus';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Cervix = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Cervix, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Cervix.displayName = 'proto.Cervix';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Day = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Day, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Day.displayName = 'proto.Day';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Bleeding.prototype.toObject = function(opt_includeInstance) {
  return proto.Bleeding.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Bleeding} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Bleeding.toObject = function(includeInstance, msg) {
  var f, obj = {
    strength: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Bleeding}
 */
proto.Bleeding.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Bleeding;
  return proto.Bleeding.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Bleeding} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Bleeding}
 */
proto.Bleeding.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.Bleeding.Strength} */ (reader.readEnum());
      msg.setStrength(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Bleeding.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Bleeding.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Bleeding} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Bleeding.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStrength();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.Bleeding.Strength = {
  STRENGTH_NONE: 0,
  STRENGTH_WEAK: 1,
  STRENGTH_MEDIUM: 2,
  STRENGTH_STRONG: 3
};

/**
 * optional Strength strength = 1;
 * @return {!proto.Bleeding.Strength}
 */
proto.Bleeding.prototype.getStrength = function() {
  return /** @type {!proto.Bleeding.Strength} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.Bleeding.Strength} value
 * @return {!proto.Bleeding} returns this
 */
proto.Bleeding.prototype.setStrength = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Temperature.prototype.toObject = function(opt_includeInstance) {
  return proto.Temperature.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Temperature} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Temperature.toObject = function(includeInstance, msg) {
  var f, obj = {
    value: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    timestamp: jspb.Message.getFieldWithDefault(msg, 2, ""),
    note: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Temperature}
 */
proto.Temperature.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Temperature;
  return proto.Temperature.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Temperature} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Temperature}
 */
proto.Temperature.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setValue(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTimestamp(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setNote(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Temperature.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Temperature.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Temperature} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Temperature.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValue();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = message.getTimestamp();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getNote();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional float value = 1;
 * @return {number}
 */
proto.Temperature.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.Temperature} returns this
 */
proto.Temperature.prototype.setValue = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional string timestamp = 2;
 * @return {string}
 */
proto.Temperature.prototype.getTimestamp = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.Temperature} returns this
 */
proto.Temperature.prototype.setTimestamp = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string note = 3;
 * @return {string}
 */
proto.Temperature.prototype.getNote = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.Temperature} returns this
 */
proto.Temperature.prototype.setNote = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Mucus.prototype.toObject = function(opt_includeInstance) {
  return proto.Mucus.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Mucus} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Mucus.toObject = function(includeInstance, msg) {
  var f, obj = {
    feeling: jspb.Message.getFieldWithDefault(msg, 1, 0),
    texture: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Mucus}
 */
proto.Mucus.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Mucus;
  return proto.Mucus.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Mucus} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Mucus}
 */
proto.Mucus.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.Mucus.Feeling} */ (reader.readEnum());
      msg.setFeeling(value);
      break;
    case 2:
      var value = /** @type {!proto.Mucus.Texture} */ (reader.readEnum());
      msg.setTexture(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Mucus.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Mucus.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Mucus} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Mucus.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFeeling();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getTexture();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.Mucus.Feeling = {
  FEELING_NONE: 0,
  FEELING_DRY: 1,
  FEELING_WET: 2,
  FEELING_SLIPPERY: 3
};

/**
 * @enum {number}
 */
proto.Mucus.Texture = {
  TEXTURE_NONE: 0,
  TEXTURE_CREAMY: 1,
  TEXTURE_EGG_WHITE: 2
};

/**
 * optional Feeling feeling = 1;
 * @return {!proto.Mucus.Feeling}
 */
proto.Mucus.prototype.getFeeling = function() {
  return /** @type {!proto.Mucus.Feeling} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.Mucus.Feeling} value
 * @return {!proto.Mucus} returns this
 */
proto.Mucus.prototype.setFeeling = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional Texture texture = 2;
 * @return {!proto.Mucus.Texture}
 */
proto.Mucus.prototype.getTexture = function() {
  return /** @type {!proto.Mucus.Texture} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.Mucus.Texture} value
 * @return {!proto.Mucus} returns this
 */
proto.Mucus.prototype.setTexture = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Cervix.prototype.toObject = function(opt_includeInstance) {
  return proto.Cervix.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Cervix} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Cervix.toObject = function(includeInstance, msg) {
  var f, obj = {
    opening: jspb.Message.getFieldWithDefault(msg, 1, 0),
    firmness: jspb.Message.getFieldWithDefault(msg, 2, 0),
    position: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Cervix}
 */
proto.Cervix.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Cervix;
  return proto.Cervix.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Cervix} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Cervix}
 */
proto.Cervix.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.Cervix.Opening} */ (reader.readEnum());
      msg.setOpening(value);
      break;
    case 2:
      var value = /** @type {!proto.Cervix.Firmness} */ (reader.readEnum());
      msg.setFirmness(value);
      break;
    case 3:
      var value = /** @type {!proto.Cervix.Position} */ (reader.readEnum());
      msg.setPosition(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Cervix.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Cervix.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Cervix} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Cervix.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOpening();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getFirmness();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getPosition();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.Cervix.Opening = {
  OPENING_NONE: 0,
  OPENING_CLOSED: 1,
  OPENING_MEDIUM: 2,
  OPENING_RAISED: 3
};

/**
 * @enum {number}
 */
proto.Cervix.Firmness = {
  FIRMNESS_NONE: 0,
  FIRMNESS_FIRM: 1,
  FIRMNESS_MEDIUM: 2,
  FIRMNESS_SOFT: 3
};

/**
 * @enum {number}
 */
proto.Cervix.Position = {
  POSITION_NONE: 0,
  POSITION_LOW: 1,
  POSITION_CENTER: 2,
  POSITION_HIGH: 3
};

/**
 * optional Opening opening = 1;
 * @return {!proto.Cervix.Opening}
 */
proto.Cervix.prototype.getOpening = function() {
  return /** @type {!proto.Cervix.Opening} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.Cervix.Opening} value
 * @return {!proto.Cervix} returns this
 */
proto.Cervix.prototype.setOpening = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional Firmness firmness = 2;
 * @return {!proto.Cervix.Firmness}
 */
proto.Cervix.prototype.getFirmness = function() {
  return /** @type {!proto.Cervix.Firmness} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.Cervix.Firmness} value
 * @return {!proto.Cervix} returns this
 */
proto.Cervix.prototype.setFirmness = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional Position position = 3;
 * @return {!proto.Cervix.Position}
 */
proto.Cervix.prototype.getPosition = function() {
  return /** @type {!proto.Cervix.Position} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.Cervix.Position} value
 * @return {!proto.Cervix} returns this
 */
proto.Cervix.prototype.setPosition = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Day.prototype.toObject = function(opt_includeInstance) {
  return proto.Day.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Day} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Day.toObject = function(includeInstance, msg) {
  var f, obj = {
    date: jspb.Message.getFieldWithDefault(msg, 1, ""),
    excludeReason: jspb.Message.getFieldWithDefault(msg, 10, 0),
    temperature: (f = msg.getTemperature()) && proto.Temperature.toObject(includeInstance, f),
    bleeding: (f = msg.getBleeding()) && proto.Bleeding.toObject(includeInstance, f),
    mucus: (f = msg.getMucus()) && proto.Mucus.toObject(includeInstance, f),
    cervix: (f = msg.getCervix()) && proto.Cervix.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Day}
 */
proto.Day.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Day;
  return proto.Day.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Day} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Day}
 */
proto.Day.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setDate(value);
      break;
    case 10:
      var value = /** @type {!proto.ExcludeReason} */ (reader.readEnum());
      msg.setExcludeReason(value);
      break;
    case 12:
      var value = new proto.Temperature;
      reader.readMessage(value,proto.Temperature.deserializeBinaryFromReader);
      msg.setTemperature(value);
      break;
    case 13:
      var value = new proto.Bleeding;
      reader.readMessage(value,proto.Bleeding.deserializeBinaryFromReader);
      msg.setBleeding(value);
      break;
    case 14:
      var value = new proto.Mucus;
      reader.readMessage(value,proto.Mucus.deserializeBinaryFromReader);
      msg.setMucus(value);
      break;
    case 15:
      var value = new proto.Cervix;
      reader.readMessage(value,proto.Cervix.deserializeBinaryFromReader);
      msg.setCervix(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Day.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Day.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Day} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Day.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDate();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getExcludeReason();
  if (f !== 0.0) {
    writer.writeEnum(
      10,
      f
    );
  }
  f = message.getTemperature();
  if (f != null) {
    writer.writeMessage(
      12,
      f,
      proto.Temperature.serializeBinaryToWriter
    );
  }
  f = message.getBleeding();
  if (f != null) {
    writer.writeMessage(
      13,
      f,
      proto.Bleeding.serializeBinaryToWriter
    );
  }
  f = message.getMucus();
  if (f != null) {
    writer.writeMessage(
      14,
      f,
      proto.Mucus.serializeBinaryToWriter
    );
  }
  f = message.getCervix();
  if (f != null) {
    writer.writeMessage(
      15,
      f,
      proto.Cervix.serializeBinaryToWriter
    );
  }
};


/**
 * optional string date = 1;
 * @return {string}
 */
proto.Day.prototype.getDate = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.Day} returns this
 */
proto.Day.prototype.setDate = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional ExcludeReason exclude_reason = 10;
 * @return {!proto.ExcludeReason}
 */
proto.Day.prototype.getExcludeReason = function() {
  return /** @type {!proto.ExcludeReason} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
};


/**
 * @param {!proto.ExcludeReason} value
 * @return {!proto.Day} returns this
 */
proto.Day.prototype.setExcludeReason = function(value) {
  return jspb.Message.setProto3EnumField(this, 10, value);
};


/**
 * optional Temperature temperature = 12;
 * @return {?proto.Temperature}
 */
proto.Day.prototype.getTemperature = function() {
  return /** @type{?proto.Temperature} */ (
    jspb.Message.getWrapperField(this, proto.Temperature, 12));
};


/**
 * @param {?proto.Temperature|undefined} value
 * @return {!proto.Day} returns this
*/
proto.Day.prototype.setTemperature = function(value) {
  return jspb.Message.setWrapperField(this, 12, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.Day} returns this
 */
proto.Day.prototype.clearTemperature = function() {
  return this.setTemperature(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.Day.prototype.hasTemperature = function() {
  return jspb.Message.getField(this, 12) != null;
};


/**
 * optional Bleeding bleeding = 13;
 * @return {?proto.Bleeding}
 */
proto.Day.prototype.getBleeding = function() {
  return /** @type{?proto.Bleeding} */ (
    jspb.Message.getWrapperField(this, proto.Bleeding, 13));
};


/**
 * @param {?proto.Bleeding|undefined} value
 * @return {!proto.Day} returns this
*/
proto.Day.prototype.setBleeding = function(value) {
  return jspb.Message.setWrapperField(this, 13, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.Day} returns this
 */
proto.Day.prototype.clearBleeding = function() {
  return this.setBleeding(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.Day.prototype.hasBleeding = function() {
  return jspb.Message.getField(this, 13) != null;
};


/**
 * optional Mucus mucus = 14;
 * @return {?proto.Mucus}
 */
proto.Day.prototype.getMucus = function() {
  return /** @type{?proto.Mucus} */ (
    jspb.Message.getWrapperField(this, proto.Mucus, 14));
};


/**
 * @param {?proto.Mucus|undefined} value
 * @return {!proto.Day} returns this
*/
proto.Day.prototype.setMucus = function(value) {
  return jspb.Message.setWrapperField(this, 14, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.Day} returns this
 */
proto.Day.prototype.clearMucus = function() {
  return this.setMucus(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.Day.prototype.hasMucus = function() {
  return jspb.Message.getField(this, 14) != null;
};


/**
 * optional Cervix cervix = 15;
 * @return {?proto.Cervix}
 */
proto.Day.prototype.getCervix = function() {
  return /** @type{?proto.Cervix} */ (
    jspb.Message.getWrapperField(this, proto.Cervix, 15));
};


/**
 * @param {?proto.Cervix|undefined} value
 * @return {!proto.Day} returns this
*/
proto.Day.prototype.setCervix = function(value) {
  return jspb.Message.setWrapperField(this, 15, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.Day} returns this
 */
proto.Day.prototype.clearCervix = function() {
  return this.setCervix(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.Day.prototype.hasCervix = function() {
  return jspb.Message.getField(this, 15) != null;
};


/**
 * @enum {number}
 */
proto.ExcludeReason = {
  EXCLUDE_REASON_NONE: 0,
  EXCLUDE_REASON_SICK: 1,
  EXCLUDE_REASON_HUNGOVER: 2,
  EXCLUDE_REASON_SLEEP: 3
};

goog.object.extend(exports, proto);
