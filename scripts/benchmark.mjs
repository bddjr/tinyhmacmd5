import { performance } from 'perf_hooks';
import crypto from 'node:crypto';
import tiny from 'tinyhmacmd5';
import SparkMD5 from 'spark-md5';
import CryptoJS from 'crypto-js';
import blueimp from 'blueimp-md5';

// Prevent js-md5 from cheating with node:crypto
//@ts-ignore
global.window = { JS_MD5_NO_NODE_JS: true };
const jsmd5 = (await import("js-md5")).default
delete global.window

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const buffer = crypto.randomBytes(50 * 1024 * 1024); // 50MiB bytes -> 100MiB hex string
const data = buffer.toString('hex');
console.log(`Data length: ${data.length} chars (100MiB)`);
console.log('--------------------------------------------------');

/** @param {string} str */
const pad = (str) => str.padEnd(15, ' ');

// tinyhmacmd5
let start = performance.now();
let resTiny = tiny(data);
let end = performance.now();
console.log(`${pad('tinyhmacmd5')} : ${(end - start).toFixed(2)} ms`);
await sleep();

// spark-md5
start = performance.now();
let resSpark = SparkMD5.hash(data);
end = performance.now();
console.log(`${pad('spark-md5')} : ${(end - start).toFixed(2)} ms`);
await sleep();

// js-md5
start = performance.now();
//@ts-ignore
let resJsMd5 = jsmd5(data);
end = performance.now();
console.log(`${pad('js-md5')} : ${(end - start).toFixed(2)} ms`);
await sleep();

// crypto-js
start = performance.now();
let resCryptoJs = CryptoJS.MD5(data).toString();
end = performance.now();
console.log(`${pad('crypto-js')} : ${(end - start).toFixed(2)} ms`);
await sleep();

// blueimp-md5
start = performance.now();
let resBlueimp = blueimp(data);
end = performance.now();
console.log(`${pad('blueimp-md5')} : ${(end - start).toFixed(2)} ms`);
await sleep();

// native crypto
start = performance.now();
let resNative = crypto.createHash('md5').update(data).digest('hex');
end = performance.now();
console.log(`${pad('node:crypto')} : ${(end - start).toFixed(2)} ms`);

console.log('--------------------------------------------------');
// Verify correctness
if (resTiny !== resNative || resSpark !== resNative || resJsMd5 !== resNative || resBlueimp !== resNative || resCryptoJs !== resNative) {
  console.log('⚠️ WARNING: Hash results do not match!');
} else {
  console.log('✅ All pure JS implementations match node:crypto result.');
}
