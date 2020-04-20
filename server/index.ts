import http from 'http'
import path from 'path'
import formidable from 'formidable'
import fs from 'fs'

import decoder from './decoder'

const HOST = '0.0.0.0'
const POST = 3000
const formidableConfig = {
  multiples: true,
  uploadDir: path.resolve(process.cwd(), 'files'),
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024,
  maxFieldsSize: 5,
}

http
  .createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')

    if (req.url === '/decode' && req.method.toLowerCase() === 'post') {
      const form = formidable(formidableConfig)
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Upload error', err)
          res.statusCode = 400
          res.end(err.message)
          return
        }

        if (files?.file?.size) {
          const file = files.file
          if (file.name.endsWith('silk') && file.type === 'application/octet-stream') {
            decoder(file.path, fields.format)
              .then(() => {
                res.statusCode = 200
                fs.createReadStream(file.path.replace('.silk', '.' + (fields.format || 'mp3'))).pipe(res)
              })
              .catch((err) => {
                res.statusCode = 400
                console.error('Decode error', err)
                res.end('Decode error: ' + err.message)
              })
          } else {
            res.statusCode = 400
            res.end('File format invalid, only support ".silk" file!')
          }
        } else {
          res.statusCode = 400
          res.end('Please upload file!')
        }
      })
      return
    }

    res.statusCode = 405
    res.end()
  })
  .listen(POST, HOST)
  .on('error', (error) => {
    console.error('Init server error', error)
  })
  .on('listening', () => {
    console.info(`Server start at http://${HOST}:${POST}`)
  })
