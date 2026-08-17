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

let u: Uint8Array<ArrayBuffer>

u = md5('', '', true)
u = md5('', '', !0)
u = md5('', null, true)
u = md5('', undefined, true)

let x = md5('', '', Boolean() as boolean)
if (typeof x == 'string') {
    s = x
} else {
    u = x
}
