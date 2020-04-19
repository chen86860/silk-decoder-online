import { spawn } from 'child_process'
import path from 'path'

const converterPath = path.resolve(process.cwd(), 'server', 'decoder', 'converter.sh')
const supportFormat = ['ogg', 'mp3', 'wav']

const decoder = (path, format = 'mp3') =>
  new Promise((resolve, reject) => {
    if (!supportFormat.includes(format)) return reject(new Error('Target format is not support!'))

    const silkDecode = spawn('sh', [converterPath, path, format])
    silkDecode.stdout.on('data', (chunk) => console.info('' + chunk))
    silkDecode.stderr.on('data', (chunk) => console.error('' + chunk))

    silkDecode.on('exit', (code) => {
      if (code === 0) return resolve()
      return reject(code)
    })
  })

export default decoder
