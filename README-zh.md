[English](README.md) | 中文

# Tiny HMAC MD5

一个精简且可靠的 HMAC-MD5 JavaScript 实现：[`browser.min.js`](browser.min.js) 仅 **982 字节**。

- **输入类型**：`string`（UTF‑8）、`Uint8Array` 或 `Uint8ClampedArray`
- **输出类型**：16进制 `string` 或 字节数组 `Uint8Array`
- **支持 ≥ 512 MiB 的输入**：输入长度理论上支持 0 到 2⁵³-1 (`Number.MAX_SAFE_INTEGER`) 。
- **TypeScript 就绪**：[`main.d.ts`](main.d.ts)
- **0 依赖**

**在线演示**：https://bddjr.github.io/tinyhmacmd5/

`tinyhmacmd5` 并不是单纯追求“越小越好”。  
它的目标是在代码体积和运行性能之间取得平衡，因此会主动保留一些对性能有帮助的实现，最终体积不是理论上最小的。

如果你需要基于 ECMAScript 2026 的更小实现，请参阅 [`es2026`](https://github.com/bddjr/tinyhmacmd5/tree/es2026) 分支。

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

> [!NOTE]  
> 请确保输入类型符合 [`main.d.ts`](main.d.ts) 的定义。  
> 无效的类型可能会返回错误的 MD5 哈希值。

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

## 为什么做这个项目

我最初用 HMAC-MD5 只是为了请求某个网站的 API，那个网站用 `crypto-js` 的 HMAC-MD5 对请求 body 签名，以增加逆向破解难度。

但我只需要 HMAC-MD5 ，我觉得依赖 `crypto-js` 太臃肿了，Web Crypto API 又不支持 HMAC-MD5 ，我不得不引入一个依赖。

于是我找到了 `blueimp-md5` ，里面的 `md5.min.js` 只有 3750 字节，比 `js-md5` 还小。

但我觉得 `blueimp-md5` 还是过于臃肿了，里面有一些完全没有必要的设计，它会反复解析字符串再生成新的字符串，非常浪费性能。

于是，我决定改编它，使用更现代化的实现，把体积压得更小，这就是现在的 `tinyhmacmd5` 。

在改编的过程中，我发现 `blueimp-md5` 在输入的 bit-length 超过 32 位时，没有正确处理 MD5 末尾 padding 中的 64 位长度字段，它只写入了低 32 位，忽略了高 32 位。我修复了这个 bug 。

我还发现用 `Array` 处理长度超过 512 MiB 的输入可能会抛出 `RangeError`，所以我把它改成了 `Int32Array` 。

我实践证明了用极小的体积（982 字节）实现 HMAC-MD5 是可行的，而且能做到更可靠。

也许没有多少人在意这几 KB 的体积差距，但 `tinyhmacmd5` 的存在正是为了“探索未至之境”。

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
