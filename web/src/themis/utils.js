// Copyright (c) 2019 Cossack Labs Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @file
 * Miscellaneous utilities.
 */

const init = require('./initialize.js')

/**
 * Convert an object into a byte buffer.
 *
 * @throws TypeError if input type is not supported
 */
module.exports.coerceToBytes = function(buffer) {
    if (buffer instanceof Uint8Array) {
        return buffer
    }
    if (buffer instanceof ArrayBuffer) {
        return new Uint8Array(buffer)
    }
    throw new TypeError('type mismatch, expect "Uint8Array" or "ArrayBuffer"')
}

function getTextEncoder() {
    if (typeof window !== 'undefined' && window.TextEncoder) {
        return new window.TextEncoder()
    }

    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder()
    }
    
    // we are using a browser which does not support TextEncoder or in a Node process which has TextEncoder
    // available through the util package.
    const NodeTextEncoder = require('util').TextEncoder
    return new NodeTextEncoder()
}

const textEncoder = getTextEncoder()

function stringToUTF8(str) {
    return textEncoder.encode(str)
}

/**
 * Convert passphrase into a byte buffer.
 *
 * @throws TypeError if input type is not supported
 */
module.exports.passphraseBytes = function(passphrase) {
    if (typeof passphrase === 'string') {
        return stringToUTF8(passphrase)
    }
    if (passphrase instanceof Uint8Array) {
        return passphrase
    }
    if (passphrase instanceof ArrayBuffer) {
        return new Uint8Array(passphrase)
    }
    throw new TypeError('type mismatch, expect "string" or "Uint8Array", "ArrayBuffer"')
}

/**
 * Allocate a buffer of specified length on Emscripten heap.
 */
module.exports.heapAlloc = function(length) {
    // calloc() in not provided by Emscripten
    let buffer = init.libthemis._malloc(length)
    if (!!buffer) {
        init.libthemis._memset(buffer, 0, length)
    }
    return buffer
}

/**
 * Move an array into Emscripten heap from JavaScript heap.
 */
module.exports.heapPutArray = function(array, buffer) {
    init.libthemis.writeArrayToMemory(array, buffer)
}

/**
 * Move an array from Emscripten heap into JavaScript heap.
 */
module.exports.heapGetArray = function(buffer, length) {
    return init.libthemis.HEAPU8.slice(buffer, buffer + length)
}

/**
 * Free a buffer on Emscripten heap.
 */
module.exports.heapFree = function(buffer, length) {
    // Prevent sensitive data leakage througn heap:
    if (!!buffer) {
        init.libthemis._memset(buffer, 0, length)
    }
    init.libthemis._free(buffer)
}
