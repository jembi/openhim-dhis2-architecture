# OpenHIM - DHIS2 Architecture for local docker configurations

## Getting Started

The services can be deployed using docker-compose.

### Docker-compose

Navigate to the folder with the `compose.sh` script to execute the commands.

To set up the services, use the following command:

```sh
./compose.sh init
```

To tear down the services, use the following command:

```bash
./compose.sh down
```

To start up the services after a tear down, use the following command:

```bash
./compose.sh up
```

To completely remove all the services, use the following option:

```bash
./compose.sh destroy
```
