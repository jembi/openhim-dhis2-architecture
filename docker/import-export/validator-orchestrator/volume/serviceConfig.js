'use strict'

const fs = require('fs')
const http = require('http')
const path = require('path')

const MEDIATOR_HOSTNAME = process.env.MEDIATOR_HOST_NAME || 'mediator'
const MEDIATOR_API_PORT = process.env.MEDIATOR_API_PORT || 3003
const MEDIATOR_API_PATH = process.env.MEDIATOR_API_PATH || '/'
const MEDIATOR_HTTP_METHOD = process.env.MEDIATOR_HOSTNAME || 'POST'
const NUMBER_OF_CONFIG_FILES = process.env.NUMBER_OF_CONFIG_FILES || 1

const options = {
  protocol: 'http:',
  host: MEDIATOR_HOSTNAME,
  port: MEDIATOR_API_PORT,
  path: MEDIATOR_API_PATH,
  method: MEDIATOR_HTTP_METHOD,
  headers: {
    'Content-Type': 'application/json'
  }
}

// Function for sending importing the configuration
const sendRequest = (data, filePath) => {
  const req = http.request(options, res => {
    if (res.statusCode === 400) {
      let data = ''
      res.on('data', chunk => {
        data += chunk.toString()
      })

      res.on('end', () => {
        if (data) {
          data = JSON.parse(data)
          if (
            data.error && data.error.match(/duplicate key error/).length
            ) {
            console.log(`Import not done, configuration ${filePath} already exists for ${MEDIATOR_HOSTNAME}`)
            return
          }
          throw Error(`Failed to import configuration ${filePath} for ${MEDIATOR_HOSTNAME}: ${data.error}`)
        }
      })

      res.on('error', err => {
        throw Error(err)
      })
      return
    }

    if (res.statusCode == 201 || res.statusCode == 200 ) {
      console.log(`Successfully imported configuration ${filePath} for the ${MEDIATOR_HOSTNAME}`)
    } else {
      throw Error(`Failed to import the configuration for the ${MEDIATOR_HOSTNAME}: status - ${res.statusCode}`)
    }
  })

  req.on('error', error => {
    throw Error(`Failed to import the configuration for the ${MEDIATOR_HOSTNAME}: ${error}`)
  })

  req.write(data)
  req.end()
}

/*
  Send the configuration files.
  **Note** - For the import to work, the files names have to be of the format "<MEDIATOR-HOSTNAME>-<fileNumber>.json" and fileNumber must be less than the NUMBER_OF_CONFIG_FILES
  Example configuration file name - populator-1.json
*/
for (let filePostFix = 0; filePostFix < NUMBER_OF_CONFIG_FILES; filePostFix++) {
  const configFilePath = path.resolve(__dirname, `${MEDIATOR_HOSTNAME}-${filePostFix}.json`)

  fs.access(configFilePath, err => {
    if (err) throw Error(`Failed to import the configuration for the ${MEDIATOR_HOSTNAME}: ${err}`)

    const jsonData = JSON.parse(
      fs.readFileSync(configFilePath)
    )

    const data = JSON.stringify(jsonData)
    sendRequest(data, configFilePath)
  })
}
