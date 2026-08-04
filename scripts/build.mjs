import fs from 'node:fs'
import { minify_sync } from 'terser'

let src = fs.readFileSync('main.js').toString()
    .replace('*/', '*/\n{')
    .replace(/export default .+/, '')
    .concat('\n}')

const result = minify_sync(src, {
    format: {
        wrap_iife: false,
    },
    sourceMap: false,
})

let dst = result.code

fs.writeFileSync('browser.min.js', dst)
