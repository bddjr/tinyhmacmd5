# Tiny HMAC MD5

A tiny JavaScript HMAC-MD5 implementation.

The minified browser bundle ([`browser.min.js`](browser.min.js)) is only 1014 bytes.

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
```

---

## Clone

```
git clone https://github.com/bddjr/tinyhmacmd5
cd tinyhmacmd5
pnpm i
pnpm test
```
