#!/bin/bash

COMMAND=$1
TARGET=$2

if ! [[ "$TARGET" =~ ^(dhis2|openhim|validator|file-queue|all)$ ]]; then
    TARGET='all'
    echo "Defaulting to 'all' as a target as the target was either not specified or invalid"
fi

composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$COMMAND" == "import" ]; then
    if [[ "$TARGET" =~ ^(dhis2|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/dhis2/docker-compose-importer-dhis2.yml up
    fi
elif [ "$COMMAND" == "export" ]; then
    if ! [[ "$TARGET" =~ ^(dhis2|all)$ ]]; then
        echo "Export for '$TARGET' no supported"
    else
        docker-compose -f "$composeFilePath"/import-export/dhis2/docker-compose-exporter-dhis2.yml up
    fi
else
    echo "Valid options are: import or export"
fi
