/** @license https://bddjr.github.io/tinyhmacmd5/lic */

// Adapted from https://github.com/blueimp/JavaScript-MD5

let A = 1732584193
  , D = 271733878

/** @type {number[]} MD5 constants cached in memory */
let K = []

let $Math = Math

let floor = $Math.floor

/** @param {number} byteLen */
// `byteLen` may be >= 2**32, so cannot use `>>>` as a replacement for `floor`
let toBinlLen = (byteLen) => floor((byteLen + 72) / 64) * 16

/**
 * Calculate the MD5 of an array of little-endian words, and a byte length.
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
  output = [A, ~D, ~A, D],
  oldOutput = [...output],
) => {
  // console.time("binlMD5")

  // append padding
  // `l` may be >= 2**32, so cannot use `>>>` as a replacement for `floor`
  x[j - 1] = 0 | l / 2 ** 29;
  x[j - 2] = 0 | l * 8;
  x[floor(l / 4)] |= 0x80 << l * 8;

  for (; i < x.length;) {
    for (oi = j = 0; j < 64;) {
      output[oi &= 3] = (
        t0 = 0 | (
          (
            t0 = output[++oi & 3],
            t1 = output[++oi & 3],
            t2 = output[++oi & 3],
            (l = j >> 4 << 2)
              ? l > 4
                ? l > 8
                  ? t1 ^ (t0 | ~t2)  // Round 4: I
                  : t0 ^ t1 ^ t2     // Round 3: H
                : t0 & t2 | t1 & ~t2 // Round 2: G
              : t0 & t1 | ~t0 & t2   // Round 1: F
          ) +
          (
            0 | x[i + (j * (0x7351 >> l) + (0x0510 >> l) & 15)]
          ) +
          (
            t1 = "',16%).4$+07&*/5".charCodeAt(l + j % 4),
            K[63 - j++] ??= 0 | 2 ** 32 * $Math.abs($Math.sin(j))
          ) +
          output[oi + 1 & 3]
        ),
        0 | (t0 << t1 | t0 >>> 64 - t1) + output[oi + 2 & 3]
      )
    }
    for (; oi; i += 4) {
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
 * @returns {[Int32Array<ArrayBuffer> | number[], number]}
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
  // Using `Array` to process inputs over 512 MiB could throw a `RangeError`,
  // so I replaced it with `Int32Array`.
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
 * Computes the MD5 hash of the input data.  
 * If a key is provided, computes HMAC-MD5.  
 * By default, returns the hash as a lowercase hexadecimal string.  
 * If `raw` is true, returns a Uint8Array.  
 *
 * @param {string | Uint8Array | Uint8ClampedArray} data The input data to hash. Strings are UTF‑8 encoded.
 * @param {string | Uint8Array | Uint8ClampedArray | null} [key] Optional HMAC key. When given, HMAC‑MD5 is calculated instead of plain MD5.
 * @param {boolean} [raw] If true, the hash is returned as raw bytes (Uint8Array); otherwise, as a hex string.
 * @returns {string | Uint8Array<ArrayBuffer>} The MD5 (or HMAC‑MD5) digest, either as a hex string or a Uint8Array.
 */
var md5 = (data, key, raw) => {
  var i = 16
    , hasKey = key != null
    , [bdata, dataByteLen] = inputToBinl(data, /**@type {*}*/(hasKey) * i)

  /** @type {*} */
  var temp = []

  /** @type {*} */
  var out = raw ? new Uint8Array(i) : ''

  if (hasKey) {
    // HMAC
    let [bkey, keyByteLen] = inputToBinl(key, 0)
    if (keyByteLen > 64) {
      bkey = binlMD5(bkey, keyByteLen)
    }
    for (; i;) {
      // (0x36363636 ^ 0x5c5c5c5c) == 0x6a6a6a6a
      temp[--i] = 0x6a6a6a6a ^ (bdata[i] = 0x36363636 ^ bkey[i])
    }
    i = 16
    bdata = temp.concat(binlMD5(bdata, 64 + dataByteLen))
    dataByteLen = 80
  }

  bdata = binlMD5(bdata, dataByteLen)

  // binl to bytes
  for (; i;
    raw
      ? out[i] = temp
      : out = (temp >> 4 && '') + temp.toString(16) + out
  ) {
    temp = bdata[--i >> 2] >> i * 8 & 0xff
  }

  return out
}

export default md5
