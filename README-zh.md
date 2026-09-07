[English](README.md) | 中文

# Tiny HMAC MD5

精简、高效、可靠的 HMAC-MD5 JavaScript 实现。

[`browser.min.js`](browser.min.js) 仅 **955 字节**。

- **输入类型**：`string`（UTF‑8）、`Uint8Array` 或 `Uint8ClampedArray`
- **输出类型**：16进制 `string` 或 字节数组 `Uint8Array`
- **支持 ≥ 512 MiB 的输入**：输入长度理论上支持 0 到 2⁵³-137
- **TypeScript 就绪**：[`main.d.ts`](main.d.ts)
- **0 依赖**

**在线演示**：https://bddjr.github.io/tinyhmacmd5/

如果你需要基于 ECMAScript 2026 的更小实现，请参阅 [`es2026`](https://github.com/bddjr/tinyhmacmd5/tree/es2026) 分支。

> [!WARNING]  
> MD5 在密码学上已被攻破，对于安全敏感的应用而言并不安全。  
> 请勿依赖它进行密码哈希、数字签名或证书验证。

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
OS: Windows 11 专业工作站版 25H2 26200.8737  
Node.js: v26.8.1

`tinyhmacmd5` 并不是单纯追求“越小越好”。  
它的目标是在代码体积和运行性能之间取得平衡，因此会主动保留一些对性能有帮助的实现，最终体积不是理论上最小的。

---

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

它将使用 `var` 定义 `md5` 函数。

### UNPKG

```html
<script src="https://unpkg.com/tinyhmacmd5"></script>
```

它将使用 `var` 定义 `md5` 函数。

### 嵌入

你可以将 [`browser.min.js`](browser.min.js) 直接嵌入到你的脚本。  
它将使用 `var` 定义 `md5` 函数。

---

## 示范

HMAC-MD5:

```js
// 字符串 (UTF-8) 到 16进制
// 返回 "c87fdc912df24da05a6e3fed927e9d89"
md5("Hello world!👋", "HMAC key 🔑")

// 字符串 (UTF-8) 到 字节数组
// 返回 Uint8Array(16)
md5("Hello world!👋", "HMAC key 🔑", true)

// 字节数组 到 16进制
// 返回 "f881235eccf71ab49b937753a72ac673"
md5(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6))

// 字节数组 到 字节数组
// 返回 Uint8Array(16)
md5(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6), true)
```

MD5:（当 `key` 为 `null` 或 `undefined`）

```js
// 字符串 (UTF-8) 到 16进制
// 返回 "3ac851eecf9e37be7565bf073a73c9dc"
md5("Hello world!👋")

// 字符串 (UTF-8) 到 字节数组
// 返回 Uint8Array(16)
md5("Hello world!👋", null, true)

// 字节数组 到 16进制
// 返回 "5289df737df57326fcdd22597afb1fac"
md5(Uint8Array.of(1, 2, 3))

// 字节数组 到 字节数组
// 返回 Uint8Array(16)
md5(Uint8Array.of(1, 2, 3), null, true)
```

`ArrayBuffer` 需包装成 `Uint8Array` 再输入，否则会返回错误的 MD5 哈希值。

```js
let data = new ArrayBuffer(8)

// MD5: 字节数组 到 16进制
md5(new Uint8Array(data))
```

你也可以输入 `Uint8ClampedArray` ，这和输入 `Uint8Array` 的效果是一致的。

```js
// MD5: 字节数组 到 16进制
// 返回 "5289df737df57326fcdd22597afb1fac"
md5(Uint8ClampedArray.of(1, 2, 3))
```

**【⚠️不安全】**  
你也可以输入 `number[]` ，但每一项都必须是整数，且满足 `0 ≤ x ≤ 255`，否则会返回错误的 MD5 哈希值。

```js
let data = [0, 1, 127, 255]

// MD5: 字节数组 到 16进制
// 返回 "b23d6235d525eed4c4b8d741d4c2a5a1"
//@ts-ignore
md5(data)
```

---

## 运行环境

支持 [幂（`**`）](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Exponentiation) 和 [`TextEncoder`](https://developer.mozilla.org/docs/Web/API/TextEncoder) 的运行环境：

- 桌面端
  - Chrome ≥ 52 (2016-07-20)
  - Edge ≥ 79 (2020-01-15)
  - Firefox ≥ 52 (2017-03-07)
  - Opera ≥ 39 (2016-08-02)
  - Safari ≥ 10.1 (2017-03-27)
- 移动端
  - Chrome Android ≥ 52 (2016-07-27)
  - Firefox for Android ≥ 52 (2017-03-07)
  - Opera Android ≥ 41 (2016-10-25)
  - Safari on iOS ≥ 10.3 (2017-03-27)
  - Samsung Browser ≥ 6 (2017-08-23)
  - WebView Android ≥ 51 (2016-06-08)
  - WebView on iOS ≥ 10.3 (2017-03-27)

不建议在支持 `node:crypto` 的环境使用本库，因为 `node:crypto` 已内置 HMAC-MD5 。

---

## 许可证

该项目使用 [Unlicense](https://unlicense.org) 发布到公共领域。

---

## 克隆

```
git clone https://github.com/bddjr/tinyhmacmd5
cd tinyhmacmd5
pnpm i
pnpm test
```
