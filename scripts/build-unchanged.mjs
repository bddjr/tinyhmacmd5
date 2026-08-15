import assert from 'node:assert'
import fs from 'node:fs'
import { execSync } from 'node:child_process'

const fileName = 'browser.min.js'

const beforeBuild = fs.readFileSync(fileName)

execSync('pnpm build', { stdio: 'inherit' })

const afterBuild = fs.readFileSync(fileName)

assert.strict(beforeBuild.equals(afterBuild), `browser.min.js changed`)
