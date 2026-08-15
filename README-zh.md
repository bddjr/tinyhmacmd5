[English](README.md) | 中文

# Tiny HMAC MD5

一个精简且完全符合规范的 HMAC-MD5 JavaScript 实现：  
[`browser.min.js`](browser.min.js) 仅有 **1057 字节**。

- **输入类型**：`string`（UTF‑8）、`Uint8Array` 或 `Uint8ClampedArray`
- **输出类型**：16进制 `string` 或原始 `Uint8Array`
- **支持 ≥ 512 MiB 的输入**：依据 RFC 1321 实现完整的 64 位长度填充
- **TypeScript 就绪**：[`main.d.ts`](main.d.ts)
- **0 依赖**

**在线演示**：https://bddjr.github.io/tinyhmacmd5/

> [!WARNING]  
> MD5 在密码学上已被攻破，对于安全敏感的应用而言并不安全。  
> 请勿依赖它进行密码哈希、数字签名或证书验证。

## 安装

### npm


```
npm i tinyhmacmd5
```

```js
import md5 from "tinyhmacmd5";
```

### 其它包管理器

你也可以使用其它包管理器（例如 `pnpm` 或 `yarn`）代替 `npm` 。

### jsDelivr

详见 https://www.jsdelivr.com/package/npm/tinyhmacmd5

```html
<script src="https://cdn.jsdelivr.net/npm/tinyhmacmd5"></script>
```

### 嵌入

你可以将 [`browser.min.js`](browser.min.js) 直接嵌入到你的脚本。

它将使用 `var` 定义 `md5` 函数。

---

## 示范

> [!NOTE]  
> 本库不验证输入类型。  
> 请确保输入类型与 [`main.d.ts`](main.d.ts) 中的定义一致。  
> TypeScript 会在编译时捕获类型错误（除非你使用了 `any`）。  
> 无效的类型可能会产生错误的 MD5 哈希。

HMAC-MD5:

```js
// 字符串 到 16进制
// 返回 "c87fdc912df24da05a6e3fed927e9d89"
md5("Hello world!👋", "HMAC key 🔑")

// 字符串 到 字节数组
// 返回 Uint8Array<ArrayBuffer>
md5("Hello world!👋", "HMAC key 🔑", true)

// 字节数组 到 16进制
// 返回 "f881235eccf71ab49b937753a72ac673"
md5(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6))

// 字节数组 到 字节数组
// 返回 Uint8Array<ArrayBuffer>
md5(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6), true)
```

MD5:（当 `key` 为 `null` 或 `undefined`）

```js
// 字符串 到 16进制
// 返回 "3ac851eecf9e37be7565bf073a73c9dc"
md5("Hello world!👋")

// 字符串 到 字节数组
// 返回 Uint8Array<ArrayBuffer>
md5("Hello world!👋", null, true)

// 字节数组 到 16进制
// 返回 "5289df737df57326fcdd22597afb1fac"
md5(Uint8Array.of(1, 2, 3))

// 字节数组 到 字节数组
// 返回 Uint8Array<ArrayBuffer>
md5(Uint8Array.of(1, 2, 3), null, true)
```

---

## 为什么做这个项目

我最初用 HMAC-MD5 只是为了请求某个网站的 API，那个网站用 `crypto-js` 的 HMAC-MD5 对请求 body 签名，以增加逆向破解难度。

但我只需要 HMAC-MD5 ，我觉得依赖 `crypto-js` 太臃肿了，Web Crypto API 又不支持 HMAC-MD5 ，我不得不引入一个依赖。

于是我找到了 `blueimp-md5` ，里面的 `md5.min.js` 只有 3750 字节，比 `js-md5` 还小。

但我觉得 `blueimp-md5` 还是过于臃肿了，里面有一些完全没有必要的设计，它会反复用字符串转字符串，非常浪费性能。

于是，我决定改编它，使用更现代化的实现，把体积压得更小，这就是现在的 `tinyhmacmd5` 。

在改编的过程中，我还发现原作 `blueimp-md5` 并没有正确处理超过 32 位的 bit length padding，我修复了这个错误。

我还发现用 `Array` 处理长度超过 512 MiB 的输入可能会抛出 `RangeError`，所以我把它改成了 `Int32Array` 。

我实践证明了用极小的体积（1057 字节）实现 HMAC-MD5 是可行的，而且能做到更可靠。

也许没有多少人真的在意这几 KB 的体积差距，但“探索未至之境”就是 `tinyhmacmd5` 的意义。

无敌实验！

---

## 许可证

MIT 许可证  
详见: [`LICENSE`](LICENSE)

---

## 克隆

```
git clone https://github.com/bddjr/tinyhmacmd5
cd tinyhmacmd5
pnpm i
pnpm test
```
