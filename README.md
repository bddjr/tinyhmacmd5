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

### English 

(Translate by AI)

I originally needed HMAC‑MD5 just to call a certain website's API. That website used `crypto-js` to sign the request body with HMAC‑MD5, to make reverse engineering harder.

But I only needed HMAC‑MD5 — dragging in the entire `crypto-js` felt too heavy, and Web Crypto doesn't support HMAC‑MD5, so I had to pull in a dependency.

So I searched around and found a project called `blueimp-md5`. Its `md5.min.js` was only 3750 bytes.

But even `blueimp-md5` still felt too bloated. It has some unnecessary design choices that hurt performance — it repeatedly converts strings back and forth, which is highly inefficient.

So I decided to adapt it, using more modern implementations to make it even smaller. That's how `tinyhmacmd5` was born.

During the adaptation, I also discovered that the original `blueimp-md5` does not correctly handle bit length padding for inputs exceeding 32 bits, and I fixed that error.

I also found that using `Array` for inputs larger than 512 MiB could throw a `RangeError`, so I replaced it with `Int32Array`.

This project proves that a fully compliant HMAC‑MD5 implementation in an extremely small footprint is not only possible, but also more reliable.

Maybe not many people truly care about a difference of a few kilobytes. But "Into the Unknown" — that's what this project is about.

The Invincible Experiment!

### 中文

我最初用 HMAC-MD5 只是为了请求某个网站的 API，那个网站用 `crypto-js` 的 HMAC-MD5 对请求 body 签名，以增加逆向破解难度。

但我只需要 HMAC-MD5 ，我觉得依赖 `crypto-js` 太臃肿了，Web Crypto 又不支持 HMAC-MD5 ，我不得不引入一个依赖。

所以我在网上找，找到了个叫 `blueimp-md5` 的项目，里面的 `md5.min.js` 只有 3750 字节。

但我觉得 `blueimp-md5` 还是过于臃肿了，里面有一些完全没有必要且拖慢性能的设计，它会反复用字符串转字符串，非常浪费性能。

于是，我决定改编它，使用更现代化的实现，把体积压得更小，这就是现在的 `tinyhmacmd5` 。

在改编的过程中，我还发现原作 `blueimp-md5` 并没有正确处理超过 32 位的 bit length padding，我修复了这个错误。

我还发现用 `Array` 处理长度超过 512 MiB 的输入可能会抛出 `RangeError`，所以我把它改成了 `Int32Array` 。

我实践证明了用极小的体积实现 HMAC-MD5 是可行的，而且能做到更可靠。

也许没有多少人真的在意这几 KB 的体积差距，但“探索未至之境”就是这个项目的意义。

无敌实验！

---

## License

The MIT License

See: [LICENSE](LICENSE)

---

## Clone

```
git clone https://github.com/bddjr/tinyhmacmd5
cd tinyhmacmd5
pnpm i
pnpm test
```

