English | [中文](README-zh.md)

# Tiny HMAC MD5

A tiny, efficient and reliable HMAC-MD5 implementation for JavaScript.

[`browser.min.js`](browser.min.js) is only **955 bytes**.

- **Input type**: `string` (UTF‑8), `Uint8Array` or `Uint8ClampedArray`
- **Output type**: hex `string` or bytes `Uint8Array`
- **Supports inputs ≥ 512 MiB**: The input length theoretically supports 0 to 2⁵³-137
- **TypeScript‑ready**: [`main.d.ts`](main.d.ts)
- **0 dependencies**

**Live demo**: https://bddjr.github.io/tinyhmacmd5/

If you need a smaller implementation that targets ECMAScript 2026, see the [`es2026`](https://github.com/bddjr/tinyhmacmd5/tree/es2026) branch.

> [!WARNING]  
> MD5 is cryptographically broken and unsafe for security-sensitive applications.  
> Do not rely on it for password hashing, digital signatures, or certificate verification.

---

## Benchmark

```
> pnpm benchmark
$ node scripts/benchmark.mjs && node scripts/test-513MiB.mjs
Data length: 104857600 chars (100MiB)
--------------------------------------------------
tinyhmacmd5     : 388.35 ms
js-md5          : 128.71 ms
blueimp-md5     : 3823.48 ms
crypto-js       : 1553.58 ms
node:crypto     : 129.86 ms
--------------------------------------------------
✅ All pure JS implementations match node:crypto result.

--- Pure 513MiB Test (No prior small tests) ---
tinyhmacmd5 HMAC-MD5 timer: 1.886s
node:crypto HMAC-MD5 timer: 548.216ms
tinyhmacmd5 MD5 timer: 1.868s
node:crypto MD5 timer: 548.352ms
```

CPU: i5-10600KF  
DRAM: 64GiB DDR4 3333MT/s  
OS: Windows 11 Pro for Workstations 25H2 26200.8737  
Node.js: v26.8.1

`tinyhmacmd5` does not simply aim for the smallest possible size.  
Its goal is to balance code size and runtime performance, so some performance-oriented implementations are intentionally retained.  
As a result, the final size is not the smallest theoretically achievable.

---

## Setup

### npm

```
npm i tinyhmacmd5
```

```js
import md5 from "tinyhmacmd5";
```

### Other Package Managers

You can also use other package managers (e.g. `pnpm` or `yarn`) in place of `npm`.

### jsDelivr

See https://www.jsdelivr.com/package/npm/tinyhmacmd5

```html
<script src="https://cdn.jsdelivr.net/npm/tinyhmacmd5"></script>
```

It will define the `md5` function using `var`.

### UNPKG

```html
<script src="https://unpkg.com/tinyhmacmd5"></script>
```

It will define the `md5` function using `var`.

### Inline

You can embed [`browser.min.js`](browser.min.js) directly into your script.  
It will define the `md5` function using `var`.

---

## Example

HMAC-MD5:

```js
// string (UTF-8) to hex
// returns "c87fdc912df24da05a6e3fed927e9d89"
md5("Hello world!👋", "HMAC key 🔑")

// string (UTF-8) to bytes
// returns Uint8Array(16)
md5("Hello world!👋", "HMAC key 🔑", true)

// bytes to hex
// returns "f881235eccf71ab49b937753a72ac673"
md5(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6))

// bytes to bytes
// returns Uint8Array(16)
md5(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6), true)
```

MD5: (when `key` is `null` or `undefined`)

```js
// string (UTF-8) to hex
// returns "3ac851eecf9e37be7565bf073a73c9dc"
md5("Hello world!👋")

// string (UTF-8) to bytes
// returns Uint8Array(16)
md5("Hello world!👋", null, true)

// bytes to hex
// returns "5289df737df57326fcdd22597afb1fac"
md5(Uint8Array.of(1, 2, 3))

// bytes to bytes
// returns Uint8Array(16)
md5(Uint8Array.of(1, 2, 3), null, true)
```

`ArrayBuffer` must be wrapped in a `Uint8Array` before use as input; otherwise, it will return an incorrect MD5 hash.

```js
let data = new ArrayBuffer(8)

// MD5: bytes to hex
md5(new Uint8Array(data))
```

You can also input a `Uint8ClampedArray`, which has the same effect as using a `Uint8Array`.

```js
// MD5: bytes to hex
// returns "5289df737df57326fcdd22597afb1fac"
md5(Uint8ClampedArray.of(1, 2, 3))
```

**[⚠️Unsafe]**  
You can also input a `number[]`, but every element must be an integer in the range `0 ≤ x ≤ 255`; otherwise, it will return an incorrect MD5 hash.

```js
let data = [0, 1, 127, 255]

// MD5: bytes to hex
// returns "b23d6235d525eed4c4b8d741d4c2a5a1"
//@ts-ignore
md5(data)
```

---

## Runtime Environment

Environments that support [Exponentiation (`**`)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Exponentiation) and [`TextEncoder`](https://developer.mozilla.org/docs/Web/API/TextEncoder) :

- Desktop
  - Chrome ≥ 52 (2016-07-20)
  - Edge ≥ 79 (2020-01-15)
  - Firefox ≥ 52 (2017-03-07)
  - Opera ≥ 39 (2016-08-02)
  - Safari ≥ 10.1 (2017-03-27)
- Mobile
  - Chrome Android ≥ 52 (2016-07-27)
  - Firefox for Android ≥ 52 (2017-03-07)
  - Opera Android ≥ 41 (2016-10-25)
  - Safari on iOS ≥ 10.3 (2017-03-27)
  - Samsung Browser ≥ 6 (2017-08-23)
  - WebView Android ≥ 51 (2016-06-08)
  - WebView on iOS ≥ 10.3 (2017-03-27)

Not recommended for use in environments that support `node:crypto`, as `node:crypto` already provides HMAC-MD5.

---

## License

This project is released into the public domain under the [Unlicense](https://unlicense.org).

---

## Clone

```
git clone https://github.com/bddjr/tinyhmacmd5
cd tinyhmacmd5
pnpm i
pnpm test
```
