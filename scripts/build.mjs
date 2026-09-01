import fs from 'node:fs'
import { minify_sync } from 'terser'

let src = fs.readFileSync('main.js').toString()
    .replace('*/', '*/{')
    .replace(/export default .+/, '')
    .concat('\n}')

const result = minify_sync(src, {
    format: {
        wrap_iife: false,
    },
    sourceMap: false,
})

let dst = Buffer.from(result.code)

console.log(dst.byteLength, 'bytes')

fs.writeFileSync('browser.min.js', dst)
