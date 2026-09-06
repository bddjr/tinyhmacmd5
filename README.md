English | [中文](README-zh.md)

# Tiny HMAC MD5

A tiny and reliable HMAC-MD5 implementation for JavaScript:

[`browser.min.js`](browser.min.js) is only **947 bytes**.

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
pnpm benchmark
```

```
Data length: 104857600 chars (100MiB)
--------------------------------------------------
tinyhmacmd5     : 550.92 ms
js-md5          : 128.96 ms
blueimp-md5     : 3837.83 ms
crypto-js       : 1562.08 ms
node:crypto     : 129.08 ms
--------------------------------------------------
✅ All pure JS implementations match node:crypto result.

--- Pure 513MiB Test (No prior small tests) ---
tinyhmacmd5 HMAC-MD5 timer: 2.706s
node:crypto HMAC-MD5 timer: 547.808ms
tinyhmacmd5 MD5 timer: 2.693s
node:crypto MD5 timer: 550.144ms
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
npm i tinyhmacmd5@es2026
```

```js
import md5 from "tinyhmacmd5";
```

### Other Package Managers

You can also use other package managers (e.g. `pnpm` or `yarn`) in place of `npm`.

### jsDelivr

See https://www.jsdelivr.com/package/npm/tinyhmacmd5

```html
<script src="https://cdn.jsdelivr.net/npm/tinyhmacmd5@es2026"></script>
```

It will define the `md5` function using `var`.

### UNPKG

```html
<script src="https://unpkg.com/tinyhmacmd5@es2026"></script>
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

Environments that support [`Uint8Array.prototype.toHex()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toHex) :

- Desktop
  - Chrome ≥ 140 (2025-09-02)
  - Edge ≥ 140 (2025-09-05)
  - Firefox ≥ 133 (2024-11-26)
  - Opera ≥ 124 (2025-11-13)
  - Safari ≥ 18.2 (2024-12-11)
- Mobile
  - Chrome Android ≥ 140 (2025-09-02)
  - Firefox for Android ≥ 133 (2024-11-26)
  - Opera Android ≥ 92 (2025-10-08)
  - Safari on iOS ≥ 18.2 (2024-12-11)
  - Samsung Browser ×
  - WebView Android ≥ 140 (2025-09-02)
  - WebView on iOS ≥ 18.2 (2024-12-11)

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
