// tinyhmacmd5 (The Unlicense)

let $Int32Array = Int32Array

let $Uint8Array = Uint8Array

/** MD5 constants cached in memory */
let K = new $Int32Array(64).map((v, i) => 2 ** 32 * Math.sin(++i % Math.PI))

/** is big-endian */
let isBE = /** @type {0 | 1} */(new $Uint8Array(K.buffer)[0] & 1)

/** @type {(a: Uint8Array | Int32Array, ...x: any[]) => any} */
let reverse = a => a.reverse()

/**
 * Calculate the MD5 of an array of little-endian words, and a byte length.
 *
 * @param {Int32Array<ArrayBuffer>} x little-endian words
 * @param {number} l Byte length
 * 
 * @returns {Int32Array<ArrayBuffer>} MD5 Array
 */
let wordsMD5 = (
  x,
  l,
  // var:
  i = 0,
  j = 1732584193,
  cnt = 271733878,
  output = $Int32Array.of(j, ~cnt, ~j, cnt),
  xLen = x.length,
) => {
  // append padding
  // `l` may be >= 2**32, so cannot use `>>>` as a replacement for `floor`.
  // `l << 3` cannot be changed to `l * 8`, as it would trigger JIT deoptimization on large inputs.
  x[xLen - 1] = l / 2 ** 29;
  x[(l - l % 4) / 4] |= 0x80 << (x[xLen - 2] = l << 3);

  for (; i < xLen; i += 16) {
    // Avoid array destructuring, as invoking the iterator protocol hurts performance.
    let { 0: a, 1: b, 2: c, 3: d } = output
    for (l = j = 0; l < 16; l += 4) {
      for (
        ; j < 4 * l + 16
        ; b = 0 | (
          (
            (a += (
              K[j] +
              (c ^ (
                l > 4
                  ? l > 8
                    ? b | ~d       // Round 4: I
                    : b ^ d        // Round 3: H
                  : l
                    ? d & (b ^ c)  // Round 2: G
                    : ~b & (c ^ d) // Round 1: F
              )) +
              x[i + (j++ * (0x7351 >> l) + (0x0510 >> l) & 15)]
            )) << cnt | a >>> 32 - cnt // Keep `32 -` so JS engines can recognize bit rotation (ROL/ROR).
          ) + (
            a = d,
            d = c,
            c = b
          )
        )
      ) {
        cnt = "',16%).4$+07&*/5".charCodeAt(j & 3 | l)
      }
    }
    output[0] += a
    output[1] += b
    output[2] += c
    output[3] += d
  }
  return output
}

/**
 * Convert bytes to an array of little-endian words
 *
 * @param {*} input
 * @param {number} padLen pad int32 length (0 or 16)
 * 
 * @returns {[Int32Array<ArrayBuffer>, number]}
 */
let inputToWords = (
  input,
  padLen,
  // var:
  byteLen = (
    // Don't replace the type check below with something like `input.big`; it's unreliable.
    typeof input == 'string'
      ? input = new TextEncoder().encode(input)
      : input
  ).length,
  // Using `Array` to process inputs over 512 MiB could throw a `RangeError`,
  // so I replaced it with `Int32Array`.
  output = new $Int32Array(padLen + 18 + (byteLen - (byteLen + 8 & 63)) / 4),
  outputBytes = new $Uint8Array(output.buffer),
) => (
  outputBytes.set(input, padLen * 4),
  isBE && reverse(outputBytes, reverse(output)),
  [output, byteLen]
)

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
let md5 = (data, key, raw) => {
  // Do not use parameter defaults to declare variables in public functions.
  /** @type {boolean | Uint8Array<ArrayBuffer>} */
  var temp = key != null
    , [bdata, dataByteLen] = inputToWords(data, /**@type {*}*/(temp) * 16)

  if (temp) {
    // HMAC
    let [bkey, keyByteLen] = inputToWords(key, 0)
      , opad = new $Int32Array(32)
      , i = 16
    if (keyByteLen > 64) {
      bkey = wordsMD5(bkey, keyByteLen)
    }
    for (; i;) {
      // (0x36363636 ^ 0x5c5c5c5c) == 0x6a6a6a6a
      opad[--i] = 0x6a6a6a6a ^ (bdata[i] = 0x36363636 ^ bkey[i])
    }
    opad.set(wordsMD5(bdata, 64 + dataByteLen), 16)
    bdata = opad
    dataByteLen = 80
  }

  bdata = wordsMD5(bdata, dataByteLen)

  temp = new $Uint8Array(bdata.buffer)
  isBE && reverse(temp, reverse(bdata))
  return raw
    ? temp
    : temp.toHex()
}

export default md5
