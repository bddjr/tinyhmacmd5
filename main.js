/** @license https://github.com/bddjr/tinyhmacmd5/blob/HEAD/LICENSE */

// Adapted from https://github.com/blueimp/JavaScript-MD5

/** @type {"length"} */
let $length = "length"

/** @type {16} */
let $16 = 16

let $2_32 = 2 ** 32

let A = 1732584193
  , D = 271733878
  , C = ~A
  , B = ~D

let $Array = Array

let $Math = Math

let floor = $Math.floor

/** @type {number[]} */
let S = [
  738695, // 7, 12, 17, 22
  669989, // 5,  9, 14, 20
  770404, // 4, 11, 16, 23
  703814, // 6, 10, 15, 21
]

/** @type {number[]} MD5 constants cached in memory */
let K = $Array(64)

/**
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 *
 * @param {number[]} x Array of little-endian words
 * @param {number} bitLen Bit length
 * @returns {[number, number, number, number]} MD5 Array
 */
let binlMD5 = (x, bitLen) => {
  var i = 0
    , j = floor((bitLen + 64) / 512) * $16 + 14
    , l
    , t0
    , t1
    , t2

  /** @type {number} */
  var oi

  /** @type {[number, number, number, number]} */
  var output = [A, B, C, D]
    , oldOutput = [...output]
    , o = (/**@type {*}*/ _) => output[++oi & 3]

  // append padding
  x[floor(bitLen / 32)] |= 0x80 << bitLen % 32;
  x[j] = 0 | bitLen;
  x[j + 1] = 0 | bitLen / $2_32;

  for (; i < x[$length]; i += $16) {
    for (oi = j = 0; j < 64; oi -= 6) {
      output[oi & 3] = (
        t0 = (
          (
            t0 = o(),
            t1 = o(),
            t2 = o(),
            (l = j >> 4)
              ? l > 1
                ? l > 2
                  ? t1 ^ (t0 | ~t2)  // 3
                  : t0 ^ t1 ^ t2     // 2
                : t0 & t2 | t1 & ~t2 // 1
              : t0 & t1 | ~t0 & t2   // 0
          ) +
          (
            0 | x[i + (j * (0x7351 >> l * 4) + (0x0510 >> l * 4) & 15)]
          ) +
          (
            t1 = S[l] >> j % 4 * 5 & 31,
            K[j++] ??= 0 | $2_32 * $Math.abs($Math.sin(j))
          ) +
          o()
        ),
        0 | (t0 << t1 | t0 >>> 32 - t1) + o()
      )
    }
    for (oi = 4; oi;) {
      oldOutput[--oi] = output[oi] = 0 | oldOutput[oi] + output[oi]
    }
  }
  return output
}

/**
 * Convert bytes to an array of little-endian words
 *
 * @param {Uint8Array} input Raw bytes
 * @returns {number[]} Array of little-endian words
 */
let bytesToBinl = (input) => {
  var i = input[$length]
  /** @type {number[]} */
  var output = []
  for (; i;) {
    output[floor(--i / 4)] |= input[i] << i % 4 * 8
  }
  return output
}

/**
 * @param {string | Uint8Array} input 
 * @returns {Uint8Array}
 */
let inputToBytes = (input) => (
  typeof input == 'string'
    ? new TextEncoder().encode(input)
    : input
)

/**
 * @overload
 * @param {string | Uint8Array} data
 * @param {string | Uint8Array | null} [key]
 * @param {false} [raw]
 * @returns {string}
 */
/**
 * @overload
 * @param {string | Uint8Array} data
 * @param {string | Uint8Array | null} [key]
 * @param {true} raw
 * @returns {Uint8Array<ArrayBuffer>}
 */
/**
 * Computes the MD5 hash of the input data.  
 * If a key is provided, computes HMAC-MD5.  
 * By default, returns the hash as a lowercase hexadecimal string.  
 * If `raw` is true, returns a Uint8Array.  
 *
 * @param {string | Uint8Array} data The input data to hash. Strings are UTF‑8 encoded.
 * @param {string | Uint8Array | null} [key] Optional HMAC key. When given, HMAC‑MD5 is calculated instead of plain MD5.
 * @param {boolean} [raw] If true, the hash is returned as raw bytes (Uint8Array); otherwise, as a hex string.
 * @returns {string | Uint8Array<ArrayBuffer>} The MD5 (or HMAC‑MD5) digest, either as a hex string or a Uint8Array.
 */
var md5 = (data, key, raw) => {
  var bdata = bytesToBinl(data = inputToBytes(data))
    , bitLen = data[$length] * 8
    , i = $16
    , out = new Uint8Array($16)
  /** @type {*} */
  var bkey
    , pad = (/**@type {number}*/ x) => {
      bdata.unshift(...$Array($16))
      for (; i;) {
        bdata[--i] = x ^ bkey[i]
      }
      i = $16
    }

  if (key != null) {
    // HMAC
    bkey = bytesToBinl(key = inputToBytes(key))
    if (bkey[$length] > $16) {
      bkey = binlMD5(bkey, key[$length] * 8)
    }
    pad(0x36363636)
    bdata = binlMD5(bdata, 512 + bitLen)
    pad(0x5c5c5c5c)
    bitLen = 512 + 128
  }

  bdata = binlMD5(bdata, bitLen)

  // binl to bytes
  for (; i;) {
    out[--i] = bdata[i >> 2] >>> i % 4 * 8
  }

  return raw
    ? out
    : out.reduce((p, v) => p + (v >> 4 && '') + v.toString($16), '')
}

export default md5
