/** @license https://bddjr.github.io/tinyhmacmd5/lic */

// Adapted from https://github.com/blueimp/JavaScript-MD5

let A = 1732584193
  , D = 271733878
  , C = ~A
  , B = ~D

let $2_32 = 2 ** 32

let $Math = Math

let floor = $Math.floor

/** @param {number} byteLen */
let toBinlLen = (byteLen) => floor((byteLen + 8) / 64) * 16 + 16

/** @type {number[]} MD5 constants cached in memory */
let K = []

/**
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 *
 * @param {Int32Array | number[]} x Array of little-endian words
 * @param {number} l Byte length
 * 
 * @param {number} [j]
 * @param {number} [t0]
 * @param {number} [t1]
 * @param {number} [t2]
 * @param {number} [oi]
 * 
 * @returns {number[]} MD5 Array
 */
let binlMD5 = (
  x,
  l,
  // var:
  i = 0,
  j = toBinlLen(l),
  t0,
  t1,
  t2,
  oi,
  output = [A, B, C, D],
  oldOutput = [...output],
) => {
  // console.time("binlMD5")

  // append padding
  x[j - 1] = l * 8 / $2_32;
  x[j - 2] = l * 8;
  x[floor(l / 4)] |= 0x80 << l % 4 * 8;

  for (; i < x.length; i += 16) {
    for (oi = j = 0; j < 64;) {
      output[oi & 3] = (
        t0 = 0 | (
          (
            t0 = output[++oi & 3],
            t1 = output[++oi & 3],
            t2 = output[++oi & 3],
            (l = j >> 4 << 2)
              ? l > 4
                ? l > 8
                  ? t1 ^ (t0 | ~t2)  // Round 4: II
                  : t0 ^ t1 ^ t2     // Round 3: HH
                : t0 & t2 | t1 & ~t2 // Round 2: GG
              : t0 & t1 | ~t0 & t2   // Round 1: FF
          ) +
          (
            0 | x[i + (j * (0x7351 >> l) + (0x0510 >> l) & 15)]
          ) +
          (
            t1 = "',16%).4$+07&*/5".charCodeAt(l + j % 4) - 32,
            K[63 - j++] ??= 0 | $2_32 * $Math.abs($Math.sin(j))
          ) +
          output[oi + 1 & 3]
        ),
        0 | (t0 << t1 | t0 >>> 32 - t1) + output[oi + 2 & 3]
      )
    }
    for (oi = 4; oi;) {
      oldOutput[--oi] = output[oi] = 0 | oldOutput[oi] + output[oi]
    }
  }
  // console.timeEnd("binlMD5")
  return output
}

/**
 * Convert bytes to an array of little-endian words
 *
 * @param {*} input
 * @param {number} j pad int32 length
 * 
 * @returns {[Int32Array | number[], number]}
 */
let inputToBinl = (
  input,
  j,
  // var:
  byteLen = (
    typeof input == 'string'
      ? input = new TextEncoder().encode(input)
      : input
  ).length,
  output = new Int32Array(toBinlLen(j * 4 + byteLen)),
  i = 0,
) => {
  // console.time("inputToBinl")
  for (; i < byteLen;) {
    output[j++] = (
      input[i++] |
      input[i++] << 8 |
      input[i++] << 16 |
      input[i++] << 24
    )
  }
  // console.timeEnd("inputToBinl")
  return [output, byteLen]
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
 * @param {string | Uint8Array | null | undefined} key
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
  var i = 16
    , hasKey = key != null
    , [bdata, dataByteLen] = inputToBinl(data, /**@type {*}*/(hasKey) * i)
    , out = new Uint8Array(i)

  if (hasKey) {
    // HMAC
    let [bkey, keyByteLen] = inputToBinl(key, 0)
    let pad5cArr = []
    if (keyByteLen > 64) {
      bkey = binlMD5(bkey, keyByteLen)
    }
    for (; i;) {
      bdata[--i] = 0x36363636 ^ bkey[i]
      pad5cArr[i] = 0x5c5c5c5c ^ bkey[i]
    }
    i = 16
    bdata = binlMD5(bdata, 64 + dataByteLen)
    bdata.unshift(...pad5cArr)
    dataByteLen = 80
  }

  bdata = binlMD5(bdata, dataByteLen)

  // binl to bytes
  for (; i;) {
    out[--i] = bdata[i >> 2] >>> i % 4 * 8
  }

  return raw
    ? out
    : out.reduce((p, v) => p + (v >> 4 && '') + v.toString(16), '')
}

export default md5
