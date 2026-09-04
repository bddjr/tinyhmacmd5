/*! npmjs.com/tinyhmacmd5 */

// Adapted from https://github.com/blueimp/JavaScript-MD5

let $Math = Math

let floor = $Math.floor

let $Int32Array = Int32Array

/** MD5 constants cached in memory */
let K = new $Int32Array(64).map((v, i) => 2 ** 32 * $Math.abs($Math.sin(i + 1)))

/**
 * Calculate the MD5 of an array of little-endian words, and a byte length.
 *
 * @param {Int32Array<ArrayBuffer>} x little-endian words
 * @param {number} l Byte length
 * 
 * @param {number} [j]
 * @param {number} [t2]
 * @param {number} [oi]
 * 
 * @returns {Int32Array<ArrayBuffer>} MD5 Array
 */
let wordsMD5 = (
  x,
  l,
  // var:
  i = 0,
  j,
  t0 = 1732584193,
  t1 = 271733878,
  t2,
  oi,
  xLen = x.length,
  output = $Int32Array.of(t0, ~t1, ~t0, t1),
  oldOutput = new $Int32Array(output),
) => {
  // append padding
  // `l` may be >= 2**32, so cannot use `>>>` as a replacement for `floor`
  x[xLen - 1] = l / 2 ** 29;
  x[floor(l / 4)] |= 0x80 << (x[xLen - 2] = l << 3);

  for (; i < xLen; i += 16) {
    for (l = 0; l < 16; l += 4) {
      for (j = 0; j < 16;) {
        output[oi &= 3] = (
          (
            t1 = (
              output[oi] +
              K[l * 4 + j] +
              (
                t0 = output[++oi & 3],
                t1 = output[++oi & 3],
                t2 = output[++oi & 3],
                l
                  ? t1 ^ (
                    l > 4
                      ? l > 8
                        ? t0 | ~t2     // Round 4: I
                        : t0 ^ t2      // Round 3: H
                      : t2 & (t0 ^ t1) // Round 2: G
                  )
                  : t0 & t1 | ~t0 & t2 // Round 1: F
              ) +
              x[i + (j * (0x7351 >> l) + (0x0510 >> l) & 15)]
            )
          ) << (
            t2 = "',16%).4$+07&*/5".charCodeAt(j++ & 3 | l) - 32
          ) | t1 >>> 32 - t2
        ) + t0
      }
    }
    for (; oi;) {
      oldOutput[--oi] = output[oi] += oldOutput[oi]
    }
  }
  return output
}

/**
 * Convert bytes to an array of little-endian words
 *
 * @param {*} input
 * @param {number} j pad int32 length (0 or 16)
 * 
 * @returns {[Int32Array<ArrayBuffer>, number]}
 */
let inputToWords = (
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
  output = new $Int32Array(j + floor((byteLen + 72) / 64) * 16),
  i = 0,
) => {
  for (; i < byteLen;) {
    output[j++] = (
      input[i++] |
      input[i++] << 8 |
      input[i++] << 16 |
      input[i++] << 24
    )
  }
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
    , [bdata, temp] = inputToWords(data, /**@type {*}*/(hasKey) * i)

  /** @type {*} */
  var out = raw ? new Uint8Array(i) : ''

  if (hasKey) {
    // HMAC
    let [bkey, j] = inputToWords(key, 0)
      , opad = new $Int32Array(32)
    if (j > 64) {
      bkey = wordsMD5(bkey, j)
    }
    for (j = i; j;) {
      // (0x36363636 ^ 0x5c5c5c5c) == 0x6a6a6a6a
      opad[--j] = 0x6a6a6a6a ^ (bdata[j] = 0x36363636 ^ bkey[j])
    }
    opad.set(wordsMD5(bdata, 64 + temp), i)
    bdata = opad
    temp = 80
  }

  bdata = wordsMD5(bdata, temp)

  // words to bytes or hex
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
