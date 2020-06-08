'use strict'

const fs = require('fs')
const http = require('http')
const path = require('path')
const zlib = require('zlib')

const DHIS2_API_HOSTNAME = process.env.DHIS2_API_HOSTNAME || 'dhis-web'
const DHIS2_API_PASSWORD = process.env.DHIS2_API_PASSWORD || 'district'
const DHIS2_API_PORT = process.env.DHIS2_API_PORT || 8080
const DHIS2_API_USERNAME = process.env.DHIS2_API_USERNAME || 'admin'
const DHIS2_METADATA_FILENAME =
  process.env.DHIS2_METADATA_FILENAME || 'metadata.json.gz'

const authHeader = new Buffer.from(
  `${DHIS2_API_USERNAME}:${DHIS2_API_PASSWORD}`
).toString('base64')

exports.importMetaData = async () => {
  const fileContents = fs.createReadStream(
    path.resolve(__dirname, DHIS2_METADATA_FILENAME)
  )
  const unzip = zlib.createGunzip()

  function streamToString(stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
  }

  const configData = await streamToString(fileContents.pipe(unzip))

  console.log(
    'Importing DHIS2 data... Byte Length: ',
    Buffer.byteLength(configData)
  )

  const options = {
    protocol: 'http:',
    hostname: DHIS2_API_HOSTNAME,
    port: DHIS2_API_PORT,
    path: '/api/metadata',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(configData),
      Authorization: `Basic ${authHeader}`
    }
  }

  const req = http.request(options, (res) => {
    if (res.statusCode == 401) {
      throw new Error(`Incorrect DHIS2 API credentials`)
    }

    if (res.statusCode != 200) {
      throw new Error(`Failed to import DHIS2 config: ${res.statusCode}`)
    }

    console.log('Successfully Imported DHIS2 Config')
  })

  req.on('error', (error) => {
    throw new Error(`Failed to import DHIS2 config: ${error.message}`)
  })

  req.write(configData)
  req.end()
}

exports.exportMetaData = async () => {
  const options = {
    protocol: 'http:',
    hostname: DHIS2_API_HOSTNAME,
    port: DHIS2_API_PORT,
    path: '/api/metadata.json',
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${authHeader}`
    }
  }

  const req = http.request(options, (res) => {
    const writeStream = fs.createWriteStream(DHIS2_METADATA_FILENAME)
    const zip = zlib.createGzip()
    if (res.statusCode == 401) {
      throw new Error(`Incorrect DHIS2 API credentials`)
    }

    if (res.statusCode != 200) {
      throw new Error(`Failed to export DHIS2 config: ${res.statusCode}`)
    }

    res
      .pipe(zip)
      .pipe(writeStream)
      .on('finish', (err) => {
        if (err) throw err
        console.log('Successfully exported DHIS2 config')
      })
  })

  req.on('error', (error) => {
    console.error('Failed to export DHIS2 config: ', error.message)
  })

  req.end()
}
