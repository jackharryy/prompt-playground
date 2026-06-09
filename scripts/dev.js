#!/usr/bin/env node
import fs from 'fs'
import { spawn } from 'child_process'
import path from 'path'

const root = process.cwd()
const proxyEnv = path.join(root, 'proxy', '.env')
const proxyExample = path.join(root, 'proxy', '.env.example')

function ensureProxyEnv() {
  if (!fs.existsSync(proxyEnv)) {
    if (fs.existsSync(proxyExample)) {
      fs.copyFileSync(proxyExample, proxyEnv)
      console.log('Created proxy/.env from .env.example. Please edit it and add your OPENAI_KEY.')
    } else {
      console.warn('No proxy/.env or proxy/.env.example found. Create proxy/.env with OPENAI_KEY.')
    }
  } else {
    console.log('proxy/.env exists.')
  }
}

ensureProxyEnv()

const proc = spawn('npm', ['run', 'dev:all'], { stdio: 'inherit', shell: true })
proc.on('close', (code) => process.exit(code))
