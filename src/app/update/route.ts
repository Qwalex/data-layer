import { NextResponse } from 'next/server'
import util from 'node:util'

const execFile = util.promisify(require('node:child_process').execFile);
 
export async function GET() {
  const { stdout, stderr } = await execFile('/bin/sh', ['./update.sh']);

  return NextResponse.json({ stdout, stderr }, { status: 500 })
}
