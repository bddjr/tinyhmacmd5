/** @license https://github.com/bddjr/tinyhmacmd5/blob/HEAD/LICENSE */

// Adapted from https://github.com/blueimp/JavaScript-MD5

/** @type {"length"} */
let $length = "length"

/** @type {16} */
let $16 = 16

/** @type {0x100000000} */
let $2_32 = 2 ** 32

let $Math = Math

let floor = $Math.floor

/**
 * Add integers, wrapping at 2^32.
 *
 * @param {number} x First integer
 * @param {number} y Second integer
 * @returns {number} Sum
 */
let safeAdd = (x, y) => 0 | (0 | x) + (0 | y)

/**
 * Bitwise rotate a 32-bit number to the left.
 *
 * @param {number} num 32-bit number
 * @param {number} cnt Rotation count
 * @returns {number} Rotated number
 */
let bitRotateLeft = (num, cnt) => (num << cnt) | (num >>> (32 - cnt))

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} q q
 * @param {number} a a
 * @param {number} b b
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5cmn = (q, a, b, x, s, t) => safeAdd(bitRotateLeft(safeAdd(a, q) + safeAdd(x, t), s), b)

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} a a
 * @param {number} b b
 * @param {number} c c
 * @param {number} d d
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5ff = (a, b, c, d, x, s, t) => md5cmn((b & c) | (~b & d), a, b, x, s, t)

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} a a
 * @param {number} b b
 * @param {number} c c
 * @param {number} d d
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5gg = (a, b, c, d, x, s, t) => md5cmn((b & d) | (c & ~d), a, b, x, s, t)

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} a a
 * @param {number} b b
 * @param {number} c c
 * @param {number} d d
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5hh = (a, b, c, d, x, s, t) => md5cmn(b ^ c ^ d, a, b, x, s, t)

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} a a
 * @param {number} b b
 * @param {number} c c
 * @param {number} d d
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5ii = (a, b, c, d, x, s, t) => md5cmn(c ^ (b | ~d), a, b, x, s, t)

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
    , b = -271733879
    , c = -1732584194
    , d = 271733878
    , padLenIndex = floor((bitLen + 64) / 512) * $16 + 14

  // append padding
  x[floor(bitLen / 32)] |= 0x80 << bitLen % 32;
  x[padLenIndex] = 0 | bitLen;
  x[padLenIndex + 1] = 0 | bitLen / $2_32;

  for (; i < x[$length]; d = safeAdd(d, oldd)) {
    let [
      x0, x1, x2, x3, x4, x5, x6, x7,
      x8, x9, x10, x11, x12, x13, x14, x15
    ] = x.slice(i, i += $16)

    olda = a
    oldb = b
    oldc = c
    oldd = d

    a = md5ff(a, b, c, d, x0, 7, K[0])
    d = md5ff(d, a, b, c, x1, 12, K[1])
    c = md5ff(c, d, a, b, x2, 17, K[2])
    b = md5ff(b, c, d, a, x3, 22, K[3])
    a = md5ff(a, b, c, d, x4, 7, K[4])
    d = md5ff(d, a, b, c, x5, 12, K[5])
    c = md5ff(c, d, a, b, x6, 17, K[6])
    b = md5ff(b, c, d, a, x7, 22, K[7])
    a = md5ff(a, b, c, d, x8, 7, K[8])
    d = md5ff(d, a, b, c, x9, 12, K[9])
    c = md5ff(c, d, a, b, x10, 17, K[10])
    b = md5ff(b, c, d, a, x11, 22, K[11])
    a = md5ff(a, b, c, d, x12, 7, K[12])
    d = md5ff(d, a, b, c, x13, 12, K[13])
    c = md5ff(c, d, a, b, x14, 17, K[14])
    b = md5ff(b, c, d, a, x15, 22, K[15])

    a = md5gg(a, b, c, d, x1, 5, K[16])
    d = md5gg(d, a, b, c, x6, 9, K[17])
    c = md5gg(c, d, a, b, x11, 14, K[18])
    b = md5gg(b, c, d, a, x0, 20, K[19])
    a = md5gg(a, b, c, d, x5, 5, K[20])
    d = md5gg(d, a, b, c, x10, 9, K[21])
    c = md5gg(c, d, a, b, x15, 14, K[22])
    b = md5gg(b, c, d, a, x4, 20, K[23])
    a = md5gg(a, b, c, d, x9, 5, K[24])
    d = md5gg(d, a, b, c, x14, 9, K[25])
    c = md5gg(c, d, a, b, x3, 14, K[26])
    b = md5gg(b, c, d, a, x8, 20, K[27])
    a = md5gg(a, b, c, d, x13, 5, K[28])
    d = md5gg(d, a, b, c, x2, 9, K[29])
    c = md5gg(c, d, a, b, x7, 14, K[30])
    b = md5gg(b, c, d, a, x12, 20, K[31])

    a = md5hh(a, b, c, d, x5, 4, K[32])
    d = md5hh(d, a, b, c, x8, 11, K[33])
    c = md5hh(c, d, a, b, x11, $16, K[34])
    b = md5hh(b, c, d, a, x14, 23, K[35])
    a = md5hh(a, b, c, d, x1, 4, K[36])
    d = md5hh(d, a, b, c, x4, 11, K[37])
    c = md5hh(c, d, a, b, x7, $16, K[38])
    b = md5hh(b, c, d, a, x10, 23, K[39])
    a = md5hh(a, b, c, d, x13, 4, K[40])
    d = md5hh(d, a, b, c, x0, 11, K[41])
    c = md5hh(c, d, a, b, x3, $16, K[42])
    b = md5hh(b, c, d, a, x6, 23, K[43])
    a = md5hh(a, b, c, d, x9, 4, K[44])
    d = md5hh(d, a, b, c, x12, 11, K[45])
    c = md5hh(c, d, a, b, x15, $16, K[46])
    b = md5hh(b, c, d, a, x2, 23, K[47])

    a = md5ii(a, b, c, d, x0, 6, K[48])
    d = md5ii(d, a, b, c, x7, 10, K[49])
    c = md5ii(c, d, a, b, x14, 15, K[50])
    b = md5ii(b, c, d, a, x5, 21, K[51])
    a = md5ii(a, b, c, d, x12, 6, K[52])
    d = md5ii(d, a, b, c, x3, 10, K[53])
    c = md5ii(c, d, a, b, x10, 15, K[54])
    b = md5ii(b, c, d, a, x1, 21, K[55])
    a = md5ii(a, b, c, d, x8, 6, K[56])
    d = md5ii(d, a, b, c, x15, 10, K[57])
    c = md5ii(c, d, a, b, x6, 15, K[58])
    b = md5ii(b, c, d, a, x13, 21, K[59])
    a = md5ii(a, b, c, d, x4, 6, K[60])
    d = md5ii(d, a, b, c, x11, 10, K[61])
    c = md5ii(c, d, a, b, x2, 15, K[62])
    b = md5ii(b, c, d, a, x9, 21, K[63])

    a = safeAdd(a, olda)
    b = safeAdd(b, oldb)
    c = safeAdd(c, oldc)
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

/** @type {number[]} MD5 constants generated dynamically to save space */
let K = []
let i = 64
for (; i;) {
  K[i - 1] = 0 | $2_32 * $Math.abs($Math.sin(i--))
}

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
      for (; i;) {
        bdata.unshift(x ^ bkey[--i])
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
  // : out.toHex()
}

export default md5
