# Tiny HMAC MD5

A tiny, reliable JavaScript HMAC-MD5 implementation.

The minified browser bundle ([`browser.min.js`](browser.min.js)) is only 1210 bytes.

Preview: https://bddjr.github.io/tinyhmacmd5/

## Setup

### npm

```
npm i tinyhmacmd5
```

```js
import md5 from "tinyhmacmd5";
```

### jsDelivr

See https://www.jsdelivr.com/package/npm/tinyhmacmd5

```html
<script src="https://cdn.jsdelivr.net/npm/tinyhmacmd5"></script>
```

---

## Example

The "data" or "key" parameter must be a string, `Uint8Array` or `Uint8ClampedArray`.

If the "key" parameter is `null` or `undefined`, HMAC is not used.

HMAC-MD5:

```js
// string to hex
// returns "c87fdc912df24da05a6e3fed927e9d89"
md5("Hello world!👋", "HMAC key 🔑")

// string to bytes
// returns Uint8Array<ArrayBuffer>
md5("Hello world!👋", "HMAC key 🔑", true)

// bytes to hex
// returns "f881235eccf71ab49b937753a72ac673"
md5(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6))

// bytes to bytes
// returns Uint8Array<ArrayBuffer>
md5(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6), true)

// Uint8ClampedArray to hex
// returns "f881235eccf71ab49b937753a72ac673"
md5(Uint8ClampedArray.of(1, 2, 3), Uint8ClampedArray.of(4, 5, 6))
```

MD5:

```js
// string to hex
// returns "3ac851eecf9e37be7565bf073a73c9dc"
md5("Hello world!👋")

// string to bytes
// returns Uint8Array<ArrayBuffer>
md5("Hello world!👋", null, true)

// bytes to hex
// returns "5289df737df57326fcdd22597afb1fac"
md5(Uint8Array.of(1, 2, 3))

// bytes to bytes
// returns Uint8Array<ArrayBuffer>
md5(Uint8Array.of(1, 2, 3), null, true)

// Uint8ClampedArray to hex
// returns "5289df737df57326fcdd22597afb1fac"
md5(Uint8ClampedArray.of(1, 2, 3))
```

Wrong usage:

```js
// TypeError: data or key parameter must be a string, Uint8Array or Uint8ClampedArray
md5(new ArrayBuffer(1))
md5('x', new ArrayBuffer(1))
md5(new Int8Array(1))
md5(new DataView(new ArrayBuffer(1)))
md5(1)
```

---

## Clone

```
git clone https://github.com/bddjr/tinyhmacmd5
cd tinyhmacmd5
pnpm i
pnpm test
```
