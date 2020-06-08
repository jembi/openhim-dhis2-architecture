# OpenHIM - DHIS2 Architecture for local docker configurations

## Getting Started

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

To completely remove all the services, use the following command:

```bash
./compose.sh destroy
```

## Import/Export

### DHIS2

To import `metadata` into DHIS2, `gzip` the file and move it into this directory `import-export/dhis2/importer/metadata.json.gz`.

Then run the `import-export` bash script, from the `/docker` directory, as shown below:

```sh
./import-export.sh import dhis2
```

This may take a few minutes.

To export your DHIS2 instances metadata, run the command below from the `/docker` directory:

```sh
./import-export.sh export dhis2
```
