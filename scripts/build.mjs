import fs from 'node:fs'
import { minify_sync } from 'terser'

let src = '{' + (
    fs.readFileSync('main.js').toString()
        .replace('let md5 =', 'var md5 =')
        .replace(/export default .+/, '')
) + '}'

const result = minify_sync(src, {
    format: {
        wrap_iife: false,
    },
    sourceMap: false,
})

let dst = Buffer.from(result.code)

console.log(dst.byteLength, 'bytes')

fs.writeFileSync('browser.min.js', dst)
