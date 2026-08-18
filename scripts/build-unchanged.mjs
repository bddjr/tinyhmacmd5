import assert from 'node:assert'
import fs from 'node:fs'
import { execSync } from 'node:child_process'

const names = [
    "browser.min.js",
]

const beforeBuild = names.map(name => fs.readFileSync(name))

execSync('pnpm build', { stdio: 'inherit' })

names.forEach((name, index) => {
    const before = beforeBuild[index]
    const now = fs.readFileSync(name)
    assert.strict(before.equals(now), `${name} changed`)
})
