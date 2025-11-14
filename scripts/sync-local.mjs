#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync, renameSync } from 'node:fs'
import { resolve, join } from 'node:path'
import os from 'node:os'

const root = process.cwd()
const lightningDir = resolve(root, '../lightning-js')
const checkoutDir = resolve(root, '../mdk-checkout')
const lightningLocalTarball = join(root, 'lightning-js-local.tgz')
const localTarball = join(root, 'mdk-checkout-local.tgz')

for (const [label, dir] of [
  ['lightning-js', lightningDir],
  ['mdk-checkout', checkoutDir],
]) {
  if (!existsSync(dir)) {
    console.error(`[sync-local] Expected ${label} repo at ${dir}`)
    process.exit(1)
  }
}

const cleanup = []
const makeTempDir = () => {
  const dir = mkdtempSync(join(os.tmpdir(), 'mdk-sync-'))
  cleanup.push(dir)
  return dir
}

const runStep = (label, command, cwd) => {
  console.log(`\n[sync-local] ${label}\n> ${command}`)
  execSync(command, { cwd, stdio: 'inherit' })
}

try {
  const lightningPkg = JSON.parse(readFileSync(join(lightningDir, 'package.json'), 'utf8'))
  const checkoutPkg = JSON.parse(readFileSync(join(checkoutDir, 'package.json'), 'utf8'))

  const lightningTempDir = makeTempDir()
  const checkoutTempDir = makeTempDir()

  const lightningTarballName = `${lightningPkg.name.replace(/^@/, '').replace('/', '-')}-${lightningPkg.version}.tgz`
  const lightningTarballPath = join(lightningTempDir, lightningTarballName)

  const checkoutTarballName = `${checkoutPkg.name.replace(/^@/, '').replace('/', '-')}-${checkoutPkg.version}.tgz`
  const checkoutTarballPath = join(checkoutTempDir, checkoutTarballName)
  const checkoutLockPath = join(checkoutDir, 'package-lock.json')
  let checkoutLockBackup
  if (existsSync(checkoutLockPath)) {
    checkoutLockBackup = join(checkoutTempDir, 'package-lock.json.bak')
    copyFileSync(checkoutLockPath, checkoutLockBackup)
  }

  runStep('Building lightning-js', 'npm run build', lightningDir)
  runStep('Packing lightning-js', `npm pack --pack-destination ${lightningTempDir}`, lightningDir)
  if (existsSync(lightningLocalTarball)) {
    rmSync(lightningLocalTarball)
  }
  renameSync(lightningTarballPath, lightningLocalTarball)
  runStep(
    'Installing lightning tarball into mdk-checkout',
    `npm install --no-save --install-links=false @moneydevkit/lightning-js@file:${lightningLocalTarball}`,
    checkoutDir,
  )
  runStep('Building mdk-checkout', 'npm run build', checkoutDir)
  runStep('Packing mdk-checkout', `npm pack --pack-destination ${checkoutTempDir}`, checkoutDir)
  if (checkoutLockBackup) {
    copyFileSync(checkoutLockBackup, checkoutLockPath)
  }

  if (existsSync(localTarball)) {
    rmSync(localTarball)
  }
  renameSync(checkoutTarballPath, localTarball)

  const rootLockPath = join(root, 'package-lock.json')
  const rootNodeModules = join(root, 'node_modules')
  if (existsSync(rootNodeModules)) {
    rmSync(rootNodeModules, { recursive: true, force: true })
  }
  if (existsSync(rootLockPath)) {
    rmSync(rootLockPath)
  }
  runStep('Installing local tarballs into lets-test-this', 'npm install --install-links=false', root)

  console.log('\n[sync-local] Done!')
} catch (error) {
  console.error('\n[sync-local] Failed:', error.message)
  process.exit(error.status || 1)
} finally {
  for (const path of cleanup) {
    rmSync(path, { recursive: true, force: true })
  }
}
