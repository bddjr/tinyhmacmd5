English | [中文](README-zh.md)

# Tiny HMAC MD5

A tiny and reliable HMAC-MD5 implementation for JavaScript: [`browser.min.js`](browser.min.js) is only **997 bytes**.

- **Input type**: `string` (UTF‑8), `Uint8Array` or `Uint8ClampedArray`
- **Output type**: hex `string` or raw `Uint8Array`
- **Supports inputs ≥ 512 MiB**: The input length theoretically supports 0 to $2^{53}-1$ (`Number.MAX_SAFE_INTEGER`).
- **TypeScript‑ready**: [`main.d.ts`](main.d.ts)
- **0 dependencies**

The goal of `tinyhmacmd5` is to strike a balance between size and performance, rather than sacrificing performance for the sake of minimizing size. Therefore, some performance-oriented optimizations are intentionally retained, and the final size is not the smallest theoretically achievable.

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

### Other Package Managers

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

`ArrayBuffer` must be wrapped in a `Uint8Array` before input; otherwise, it produces an incorrect MD5 hash.

```js
let data = new ArrayBuffer(8)

// MD5: bytes to hex
md5(new Uint8Array(data))
```

---

## Runtime Environment

Environments that support [Nullish coalescing assignment (`??=`)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment) :

- Chrome ≥ 85 (2020-08-25)
- Edge ≥ 85 (2020-08-27)
- Firefox ≥ 79 (2020-07-28)
- Safari ≥ 14 (2020-09-16)

Not recommended for use in environments that support `node:crypto`, as `node:crypto` already provides HMAC-MD5.

---

## Why I Made This Project

> [!NOTE]  
> AI-translated from Chinese.  
> [查看原文](README-zh.md#为什么做这个项目)

I initially used HMAC-MD5 just to call a certain website's API. That site signs the request body with `crypto-js`'s HMAC-MD5 to make reverse engineering harder.

But I only needed HMAC-MD5. Depending on `crypto-js` felt way too bloated. The Web Crypto API doesn't support HMAC-MD5, so I had no choice but to drag in a dependency.

Then I found `blueimp-md5`. Its `md5.min.js` is only 3750 bytes, even smaller than `js-md5`.

But I felt `blueimp-md5` was still far too bloated. It has some completely unnecessary design choices—it repeatedly parses strings and creates new ones, adding a lot of unnecessary overhead.

So I decided to adapt it, use a more modern implementation, and shrink the size even further. That's how `tinyhmacmd5` was born.

During the adaptation, I discovered that `blueimp-md5` did not correctly handle the 64-bit length field required by MD5 when the input bit-length exceeded 32 bits. It wrote only the low 32 bits and ignored the high 32 bits. I fixed this bug.

I also found that using `Array` to process inputs over 512 MiB could throw a `RangeError`, so I replaced it with `Int32Array`.

I demonstrated in practice that HMAC-MD5 can be implemented in an extremely small footprint (997 bytes) while also improving reliability.

Maybe not many people care about saving just a few KB, but `tinyhmacmd5` exists precisely to "explore the unknown".

INVINCIBLE EXPERIMENT!

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
