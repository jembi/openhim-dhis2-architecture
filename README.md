# OpenHIM - DHIS2 Architecture

A generic architecture for OpenHIM to DHIS2 integrations

## Architecture Overview

![OpenHIM DHIS2 Architecture](https://github.com/jembi/openhim-dhis2-architecture/blob/master/OpenHIM%20-%20DHIS2%20Architecture-Arch%202.png)

## Getting Started

The services used in the OpenHIM to DHIS2 integration can be deployed using docker-compose.

### Docker-compose

Navigate to the folder with the `deploy.sh` script to execute the commands.

To set up the services, use the following command:

```sh
./deploy.sh init docker
```

To configure the apps and services, use the following command:

```bash
./docker/import-export.sh import
```

To tear down the services, use the following command:

```bash
./deploy.sh down docker
```

To start up the services after a tear down, use the following command:

```bash
./deploy.sh up docker
```

To completely remove all the services, use the following command:

```bash
./deploy.sh destroy docker
```

## Accessing the services

### OpenHIM

- Console url: <http://localhost:9000>
- Username: **root@openhim.org**
- Password: **password**

### DHIS2

- Url : <http://localhost:8081>
- Username: **admin**
- Password: **district**

## Message Structures

Useful Links:

- [DHIS2 Tracked Entity Docs](https://docs.dhis2.org/2.34/en/dhis2_developer_manual/web-api.html#tracked-entity-instance-management)

### OpenHIM Client details

- username: **client**
- password: **test**

### Tracked Entity (Pregnancy Tracker)

POST data to `/entity-based/pregnancy-tracker/1st-trimester`

#### Tracked Entity Message Example

```json
{
  "facilityCode": "123456",
  "rsaid": "123456",
  "name": "Jane",
  "surname": "Doe",
  "dateOfBirth": "2020-05-12",
  "establishedDueDate": true,
  "determinedNumFetusesAndPlacenta": false,
  "checkedDiagnosisEntropicPregnancyMiscarriage": false,
  "checkedUterusPelvicAnatomy": true,
  "checkedFatalAbnormalities": true
}
```

> Available pregnancy stages: `1st-trimester`, `2nd-trimester`, `3rd-trimester`, `birth`, `miscarriage`

Postman collection available [here](https://www.getpostman.com/collections/81581e8e7707356a2fe7)

### Aggregate (Severe Illness) Anonymous Events

POST data to `/aggregate/severe-illness`

Postman collection available [here](https://www.getpostman.com/collections/81581e8e7707356a2fe7)

#### Aggregate Data Value Set Message Example

```json
{
  "facilityCode": "123456",
  "period": "202006",
  "hiv": {
    "male": {
      "0-7": 30,
      "8-16": 158,
      "17-25": 235,
      "26-54": 423,
      "55+": 120
    },
    "female": {
      "0-7": 10,
      "8-16": 58,
      "17-25": 95,
      "26-54": 123,
      "55+": 80
    },
    "other": {
      "0-7": 10,
      "8-16": 0,
      "17-25": 40,
      "26-54": 65,
      "55+": 14
    }
  },
  "tb": {
    "male": {
      "0-7": 23,
      "8-16": 134,
      "17-25": 214,
      "26-54": 137,
      "55+": 245
    },
    "female": {
      "0-7": 30,
      "8-16": 134,
      "17-25": 265,
      "26-54": 365,
      "55+": 78
    },
    "other": {
      "0-7": 2,
      "8-16": 34,
      "17-25": 12,
      "26-54": 0,
      "55+": 0
    }
  },
  "cancer": {
    "male": {
      "0-7": 25,
      "8-16": 324,
      "17-25": 345,
      "26-54": 542,
      "55+": 135
    },
    "female": {
      "0-7": 27,
      "8-16": 133,
      "17-25": 288,
      "26-54": 345,
      "55+": 111
    },
    "other": {
      "0-7": 0,
      "8-16": 0,
      "17-25": 3,
      "26-54": 5,
      "55+": 1
    }
  },
  "stroke": {
    "male": {
      "0-7": 5,
      "8-16": 34,
      "17-25": 76,
      "26-54": 126,
      "55+": 89
    },
    "female": {
      "0-7": 23,
      "8-16": 89,
      "17-25": 145,
      "26-54": 231,
      "55+": 98
    },
    "other": {
      "0-7": 3,
      "8-16": 5,
      "17-25": 23,
      "26-54": 32,
      "55+": 12
    }
  }
}
```

### Program Events (Inpatient Events)

POST data to `/event-based/inpatient`

Postman collection available [here](https://www.getpostman.com/collections/81581e8e7707356a2fe7)

#### Events Based Data Value Set Message Example

```json
{
  "facilityCode": "123456",
  "dateOfAdmission": "2020-03-27",
  "dateOfDischarge": "2020-04-01",
  "primaryDiagnosis": "R27",
  "secondaryDiagnosis": "R21",
  "typeOfDischarge": "alive",
  "patientInsured": "yes"
}
```
