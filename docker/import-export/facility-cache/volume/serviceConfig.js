'use strict'

const axios = require('axios')
const fs = require('fs')
const https = require('https')
const path = require('path')

const OPENHIM_PROTOCOL = process.env.OPENHIM_PROTOCOL || 'https'
const OPENHIM_API_HOSTNAME = process.env.OPENHIM_API_HOSTNAME || 'openhim-core'
const OPENHIM_API_PASSWORD =
  process.env.OPENHIM_API_PASSWORD || 'openhim-password'
const OPENHIM_API_PORT = process.env.OPENHIM_API_PORT || 8080
const OPENHIM_API_USERNAME =
  process.env.OPENHIM_API_USERNAME || 'root@openhim.org'
const OPENHIM_MEDIATOR_URN =
  process.env.OPENHIM_MEDIATOR_URN || 'urn:uuid:generic'

const authHeader = new Buffer.from(
  `${OPENHIM_API_USERNAME}:${OPENHIM_API_PASSWORD}`
).toString('base64')

const jsonData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'facility-cache.json'))
)

const data = JSON.stringify(jsonData)

const options = {
  url: `${OPENHIM_PROTOCOL}://${OPENHIM_API_HOSTNAME}:${OPENHIM_API_PORT}/mediators/${OPENHIM_MEDIATOR_URN}/config`,
  method: 'put',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    Authorization: `Basic ${authHeader}`
  },
  data: data
}

const importData = async () => {
  try {
    const response = await axios(options)
  
    if (response.status == 401) {
      throw new Error(`Incorrect OpenHIM API credentials`)
    }
  
    if (response.status != 200) {
      throw new Error(`Failed to import OpenHIM Mediator config: ${res.statusCode}`)
    }
  
    console.log(
      `Successfully Imported OpenHIM Mediator Config.\n\nImport summary:${JSON.stringify(
        response.data
      )}`
    )
  } catch (error) {
    throw new Error(`Failed to import OpenHIM Mediator config: ${error.message}`)
  }
}

importData()
