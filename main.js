/** @license https://bddjr.github.io/tinyhmacmd5/lic */

// Adapted from https://github.com/blueimp/JavaScript-MD5

let A = 1732584193
  , D = 271733878
  , C = ~A
  , B = ~D

/** @type {number[]} MD5 constants cached in memory */
let K = []

/**
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 *
 * @param {number[]} x Array of little-endian words
 * @param {number} l Bit length
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
  j,
  t0,
  t1,
  t2,
  oi,
  output = [A, B, C, D],
  oldOutput = [...output],
  o = (
    /** @param {*} [_] */
    _ => output[++oi & 3]
  ),
) => {

  // append padding
  x[l + 64 >>> 9 << 4 | 14] = 0 | l;
  x[l >>> 5] |= 0x80 << l % 32;

  for (; i < x.length; i += 16) {
    for (oi = j = 0; j < 64; oi -= 6) {
      output[oi & 3] = (
        t0 = 0 | (
          (
            t0 = o(),
            t1 = o(),
            t2 = o(),
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
            K[63 - j++] ??= 0 | 2 ** 32 * Math.abs(Math.sin(j))
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
 * @param {string | Uint8Array} input
 * @param {number} padLen
 * 
 * @param {number[]} [output]
 * 
 * @returns {[number[], number]}
 */
let inputToBinl = (
  input,
  padLen,
  // var:
  i = (
    typeof input == 'string'
      ? input = new TextEncoder().encode(input)
      : input
  ).length,
  output = [],
  bitLen = 8 * i,
) => {
  for (; i;) {
    output[padLen + (--i >>> 2)] |= /**@type {Uint8Array}*/(input)[i] << i % 4 * 8
  }
  return [output, bitLen]
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
    , [bdata, bitLen] = inputToBinl(data, /**@type {*}*/(hasKey) * i)
    , out = new Uint8Array(i)

  if (hasKey) {
    // HMAC
    let [bkey, keyBitlen] = inputToBinl(key, 0)
      , pad = (/**@type {number}*/ x) => {
        for (; i;) {
          bdata[--i] = 0x01010101 * x ^ bkey[i]
        }
        i = 16
      }
    if (keyBitlen > 512) {
      bkey = binlMD5(bkey, keyBitlen)
    }
    pad(0x36)
    bdata = binlMD5(bdata, 512 + bitLen)
    bdata.unshift(...Array(16))
    pad(0x5c)
    bitLen = 640
  }

  bdata = binlMD5(bdata, bitLen)

  // binl to bytes
  for (; i;) {
    out[--i] = bdata[i >> 2] >>> i % 4 * 8
  }

  return raw
    ? out
    : out.reduce((p, v) => p + (v >> 4 && '') + v.toString(16), '')
}

export default md5
