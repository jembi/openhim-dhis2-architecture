'use strict'

const axios = require('axios')
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const { PassThrough } = require('stream')

const DHIS2_PROTOCOL = process.env.DHIS2_PROTOCOL || 'http'
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
    url: `${DHIS2_PROTOCOL}://${DHIS2_API_HOSTNAME}:${DHIS2_API_PORT}/api/metadata`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(configData),
      Authorization: `Basic ${authHeader}`
    },
    data: configData
  }

  try {
    const response = await axios(options)

    console.log(
      `Successfully Imported DHIS2 Config.\n\nImport summary:${JSON.stringify(
        response.data.stats
      )}`
    )
  } catch (error) {
    throw new Error(`Failed to import DHIS2 config: ${error.message}`)
  }
}

exports.exportMetaData = async () => {
  const options = {
    url: `${DHIS2_PROTOCOL}://${DHIS2_API_HOSTNAME}:${DHIS2_API_PORT}/api/metadata.json`,
    method: 'get',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${authHeader}`
    },
    validateStatus: (status) => {
      return status == 200
    }
  }

  try {
    const response = await axios(options)

    // The gzip module requires a stream of data
    const streamResponseData = new PassThrough()
    streamResponseData.write(JSON.stringify(response.data))
    streamResponseData.end()

    const writeStream = fs.createWriteStream(DHIS2_METADATA_FILENAME)
    const zip = zlib.createGzip()

    streamResponseData
      .pipe(zip)
      .pipe(writeStream)
      .on('finish', (err) => {
        if (err) throw err
        console.log(
          'Successfully exported DHIS2 config.\n\nData saved to metadata.json.gz file.'
        )
      })
  } catch (error) {
    console.error('Failed to export DHIS2 config: ', error.message)
  }
}
