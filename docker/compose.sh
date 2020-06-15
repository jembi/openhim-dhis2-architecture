#!/bin/bash

composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$1" == "init" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-dbs.yml up -d

    # Set up the replica set
    "$composeFilePath"/initiateReplicaSet.sh

    docker-compose -f "$composeFilePath"/docker-compose-apps.yml -f "$composeFilePath"/default/docker-compose-config.yml up -d

    # Allow openhim core configuration to be applied
    sleep 20

    docker-compose -f "$composeFilePath"/docker-compose-services.yml up -d
elif [ "$1" == "up" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-dbs.yml up -d

    # Wait for the dbs to be properly set up and running
    sleep 20

    docker-compose -f "$composeFilePath"/docker-compose-apps.yml up -d

    # Wait for openhim to start up
    sleep 10

    docker-compose -f "$composeFilePath"/docker-compose-services.yml up -d
elif [ "$1" == "down" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-services.yml -f "$composeFilePath"/docker-compose-apps.yml -f "$composeFilePath"/docker-compose-dbs.yml stop
elif [ "$1" == "destroy" ]; then
    echo "WARNING! This option will remove everything including database volumes"
    echo "Are you sure you want to continue? [y/N]"

    read -p ">> " destroy

    if [[ "$destroy" =~ ^(y|Y)$ ]]; then
        ./docker/import-export.sh destroy all
        docker-compose -f "$composeFilePath"/docker-compose-services.yml -f "$composeFilePath"/docker-compose-apps.yml -f "$composeFilePath"/docker-compose-dbs.yml -f "$composeFilePath"/default/docker-compose-config.yml down -v
    fi
else
    echo "Valid options are: init, up, down, or destroy"
fi
