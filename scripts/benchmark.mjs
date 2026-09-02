import tiny from 'tinyhmacmd5';
import blueimp from 'blueimp-md5';
import CryptoJS from 'crypto-js';
import jsmd5 from 'js-md5';
import crypto from 'crypto';
import { performance } from 'perf_hooks';

console.log('Generating 100MiB string data (this might take a moment)...');
const buffer = crypto.randomBytes(50 * 1024 * 1024); // 50MiB bytes -> 100MiB hex string
const data = buffer.toString('hex');
console.log(`Data length: ${data.length} chars (100MiB)`);
console.log('--------------------------------------------------');

const pad = (str) => str.padEnd(15, ' ');

// tinyhmacmd5
let start = performance.now();
let resTiny = tiny(data);
let end = performance.now();
console.log(`${pad('tinyhmacmd5')} : ${(end - start).toFixed(2)} ms`);

// js-md5
start = performance.now();
let resJsMd5 = jsmd5(data);
end = performance.now();
console.log(`${pad('js-md5')} : ${(end - start).toFixed(2)} ms`);

// blueimp-md5
start = performance.now();
let resBlueimp = blueimp(data);
end = performance.now();
console.log(`${pad('blueimp-md5')} : ${(end - start).toFixed(2)} ms`);

// crypto-js
start = performance.now();
let resCryptoJs = CryptoJS.MD5(data).toString();
end = performance.now();
console.log(`${pad('crypto-js')} : ${(end - start).toFixed(2)} ms`);

// native crypto
start = performance.now();
let resNative = crypto.createHash('md5').update(data).digest('hex');
end = performance.now();
console.log(`${pad('native crypto')} : ${(end - start).toFixed(2)} ms`);

console.log('--------------------------------------------------');
// Verify correctness
if (resTiny !== resNative || resJsMd5 !== resNative || resBlueimp !== resNative || resCryptoJs !== resNative) {
  console.log('⚠️ WARNING: Hash results do not match!');
} else {
  console.log('✅ All pure JS implementations match native crypto result.');
}
