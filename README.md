# OpenHIM - DHIS2 Architecture
A genetic architecture for OpenHIM to DHIS2 integrations

## Architecture Overview

![OpenHIM DHIS2 Architecture](https://github.com/jembi/openhim-dhis2-architecture/blob/master/OpenHIM%20-%20DHIS2%20Architecture-Arch%202.png)

## Getting Started

The services used in the OpenHim to DHIS2 integration can be deployed using docker-compose.

### Docker-compose

Navigate to the folder with the `deploy.sh` script to execute the commands.

To set up the services, use the following command:

```sh
./deploy.sh init docker
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

* Console url: <http://localhost:9000>
* Username: **root@openhim.org**
* Password: **openhim-password**

### DHIS2

* Url : <http://localhost:8081>
* Username: **admin**
* Password: **district**
