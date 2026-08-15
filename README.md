English | [中文](README-zh.md)

# Tiny HMAC MD5

A tiny, fully compliant HMAC-MD5 implementation for JavaScript:  
[`browser.min.js`](browser.min.js) is only **1057 bytes**.

- **Input type**: `string` (UTF‑8), `Uint8Array` or `Uint8ClampedArray`
- **Output type**: hex `string` or raw `Uint8Array`
- **Supports inputs ≥ 512 MiB**: Full 64‑bit length padding per RFC 1321
- **TypeScript‑ready**: [`main.d.ts`](main.d.ts)
- **0 dependencies**

**Live demo**: https://bddjr.github.io/tinyhmacmd5/

> [!WARNING]  
> MD5 is cryptographically broken and unsafe for security-sensitive applications.  
> Do not rely on it for password hashing, digital signatures, or certificate verification.

## Setup

### npm


```
npm i tinyhmacmd5
```

```js
import md5 from "tinyhmacmd5";
```

### Other package managers

You can also use other package managers (e.g. `pnpm` or `yarn`) in place of `npm`.

### jsDelivr

See https://www.jsdelivr.com/package/npm/tinyhmacmd5

```html
<script src="https://cdn.jsdelivr.net/npm/tinyhmacmd5"></script>
```

### Inline

You can embed [`browser.min.js`](browser.min.js) directly into your script.

It will define the `md5` function using `var`.

---

## Example

> [!NOTE]  
> This library does not validate input types.  
> Please ensure the input type matches the definitions in [`main.d.ts`](main.d.ts).  
> TypeScript will catch mismatches at compile time (unless you use `any`).  
> Invalid types may produce an incorrect MD5 hash.

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

MD5: (when `key` is `null` or `undefined`)

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

## Why make this project

> [!NOTE]  
> Translated by AI, from Chinese.  
> [查看原文](README-zh.md#为什么做这个项目)

I originally needed HMAC‑MD5 just to call a certain website's API. That website used `crypto-js` to sign the request body with HMAC‑MD5, to make reverse engineering harder.

But I only needed HMAC‑MD5 — dragging in the entire `crypto-js` felt too heavy, and Web Crypto API doesn't support HMAC‑MD5, so I had to pull in a dependency.

So I found `blueimp-md5` — its `md5.min.js` is only 3750 bytes, even smaller than `js-md5`.

But even `blueimp-md5` still felt too bloated. It has some completely unnecessary design choices — it repeatedly converts strings back and forth, which wastes performance.

So I decided to adapt it, using more modern implementations to make it even smaller. That's how `tinyhmacmd5` was born.

During the adaptation, I also discovered that the original `blueimp-md5` does not correctly handle bit length padding for inputs exceeding 32 bits, and I fixed that error.

I also found that using `Array` for inputs larger than 512 MiB could throw a `RangeError`, so I replaced it with `Int32Array`.

Through practice, I've proven that implementing HMAC-MD5 in an extremely small footprint (1057 bytes) is possible — and that it can be made more reliable.

Maybe not many people truly care about the difference of a few kilobytes, but "Into the Unknown" — that's what `tinyhmacmd5` is about.

INVINCIBLE_EXPERIMENT!

---

## License

The MIT License  
See: [`LICENSE`](LICENSE)

---

## Clone

```
git clone https://github.com/bddjr/tinyhmacmd5
cd tinyhmacmd5
pnpm i
pnpm test
```
