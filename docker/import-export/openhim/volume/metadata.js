'use strict'

const axios = require('axios')
const fs = require('fs')
const path = require('path')

const OPENHIM_PROTOCOL = process.env.OPENHIM_PROTOCOL || 'https'
const OPENHIM_API_HOSTNAME = process.env.OPENHIM_API_HOSTNAME || 'openhim-core'
const OPENHIM_API_PASSWORD =
  process.env.OPENHIM_API_PASSWORD || 'openhim-password'
const OPENHIM_API_PORT = process.env.OPENHIM_API_PORT || 8080
const OPENHIM_API_USERNAME =
  process.env.OPENHIM_API_USERNAME || 'root@openhim.org'

const authHeader = new Buffer.from(
  `${OPENHIM_API_USERNAME}:${OPENHIM_API_PASSWORD}`
).toString('base64')

exports.importMetaData = async () => {
  const jsonData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'openhim-import.json'))
  )

  const data = JSON.stringify(jsonData)

  const options = {
    url: `${OPENHIM_PROTOCOL}://${OPENHIM_API_HOSTNAME}:${OPENHIM_API_PORT}/metadata`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      Authorization: `Basic ${authHeader}`
    },
    data: data
  }

  try {
    const response = await axios(options)

    if (response.statusCode == 401) {
      throw new Error(`Incorrect OpenHIM API credentials`)
    }
  
    if (response.status != 201) {
      throw new Error(`Failed to export OpenHIM config: ${response.status}`)
    }

    console.log(
      `Successfully Imported OpenHIM Config.\n\nImport summary: ${JSON.stringify(
        response.data
      )}`
    )
  } catch (error) {
    throw new Error(`Failed to export OpenHIM config: ${error.message}`)
  }
}

exports.exportMetaData = async () => {
  const options = {
    url: `${OPENHIM_PROTOCOL}://${OPENHIM_API_HOSTNAME}:${OPENHIM_API_PORT}/metadata`,
    method: 'get',
    headers: {
      Authorization: `Basic ${authHeader}`
    }
  }

  try {
    const response = await axios(options)

    fs.writeFileSync(path.resolve(__dirname, 'openhim-import.json'), JSON.stringify(response.data[0], null, 2), 'utf8')

    console.log(
      `Successfully Exported OpenHIM Config.`
    )
  } catch (error) {
    throw new Error(`Failed to export OpenHIM config: ${error.message}`)
  }
}
