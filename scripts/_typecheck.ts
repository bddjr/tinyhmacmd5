// This file is only for type checking.
// No need to run it.

import md5 from "tinyhmacmd5"

let s: string

s = md5('')
s = md5('', null)
s = md5('', '')
s = md5('', '')
s = md5('', '', false)
s = md5('', '', !1)
s = md5('', '', undefined)
s = md5('', null, false)
s = md5('', undefined, false)
s = md5(Uint8Array.of())
s = md5(Uint8Array.of(), undefined, false)
s = md5(Uint8Array.of(), null, false)
s = md5(Uint8Array.of(), Uint8Array.of(), false)
s = md5(Uint8ClampedArray.of(), Uint8ClampedArray.of(), false)

let u: Uint8Array<ArrayBuffer>

u = md5('', '', true)
u = md5('', '', !0)
u = md5('', null, true)
u = md5('', undefined, true)
u = md5(Uint8Array.of(), undefined, true)
u = md5(Uint8Array.of(), null, true)
u = md5(Uint8Array.of(), Uint8Array.of(), true)
u = md5(Uint8ClampedArray.of(), Uint8ClampedArray.of(), true)

let x = md5('', '', Boolean() as boolean)

if (typeof x == 'string') {
    s = x
} else {
    u = x
}

x = md5(Uint8Array.of(), undefined, Boolean() as boolean)
x = md5(Uint8Array.of(), null, Boolean() as boolean)
x = md5(Uint8Array.of(), Uint8Array.of(), Boolean() as boolean)
x = md5(Uint8ClampedArray.of(), Uint8ClampedArray.of(), Boolean() as boolean)
