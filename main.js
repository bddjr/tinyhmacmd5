/** @license https://github.com/bddjr/tinyhmacmd5/blob/HEAD/LICENSE */

// Adapted from https://github.com/blueimp/JavaScript-MD5

/** @type {"length"} */
let $length = "length"

/** @type {16} */
let $16 = 16

let $2_32 = 2 ** 32

let $Array = Array

let $Math = Math

let floor = $Math.floor

/** @type {((b:number, c:number, d:number) => number)[]} */
let ff = [
  (b, c, d) => b & c | ~b & d,
  (b, c, d) => b & d | c & ~d,
  (b, c, d) => b ^ c ^ d,
  (b, c, d) => c ^ (b | ~d)
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
    , olda
    , oldb
    , oldc
    , oldd
    , a = 1732584193
    , d = 271733878
    , c = ~a
    , b = ~d
    , j = floor((bitLen + 64) / 512) * $16 + 14

  /** @type {number} */
  var k_i

  /** @type {number} */
  var ff_i

  /** @type {number} */
  var cmn_t

  /** @type {number[]} */
  var w = $Array($16)

  /**
  * @param {number} q
  * @param {number} a
  * @param {number} b
  * @param {number} s
  * @returns {number}
  */
  var cmn = (q, a, b, s) => (
    cmn_t = (
      a + q +
      (
        cmn_t = j++ * (7 & 0o7351 >> ff_i * 3) + (7 & 0o0510 >> ff_i * 3) & 15,
        ff_i ? w[cmn_t] : w[cmn_t] = 0 | x[i++]
      ) +
      (K[k_i++] ??= 0 | $2_32 * $Math.abs($Math.sin(k_i)))
    ),
    0 | (cmn_t << s | cmn_t >>> 32 - s) + b
  )

  /** @type {typeof ff[0]} */
  var F_f

  /**
   * @param {number} s0
   * @param {number} s1
   * @param {number} s2
   * @param {number} s3
   */
  var F = (s0, s1, s2, s3) => {
    for (F_f = ff[ff_i], j = 0; j < $16;) {
      a = cmn(F_f(b, c, d), a, b, s0)
      d = cmn(F_f(a, b, c), d, a, s1)
      c = cmn(F_f(d, a, b), c, d, s2)
      b = cmn(F_f(c, d, a), b, c, s3)
    }
    ff_i++
  }

  // append padding
  x[floor(bitLen / 32)] |= 0x80 << bitLen % 32;
  x[j] = 0 | bitLen;
  x[j + 1] = 0 | bitLen / $2_32;

  for (; i < x[$length]; d = 0 | d + oldd) {
    olda = a
    oldb = b
    oldc = c
    oldd = d

    k_i = ff_i = 0

    F(7, 12, 17, 22)
    F(5, 9, 14, 20)
    F(4, 11, $16, 23)
    F(6, 10, 15, 21)

    a = 0 | a + olda
    b = 0 | b + oldb
    c = 0 | c + oldc
  }
  return [a, b, c, d]
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
