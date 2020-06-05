#!/bin/bash

composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$1" == "init" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-dbs.yml up -d

    # Set up the replica set
    "$composeFilePath"/initiateReplicaSet.sh

    docker-compose -f "$composeFilePath"/docker-compose-apps.yml up -d
    docker-compose -f "$composeFilePath"/docker-compose-services.yml up -d
elif [ "$1" == "up" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-dbs.yml up -d

    # Wait for the dbs to be properly set up and running
    sleep 20

    docker-compose -f "$composeFilePath"/docker-compose-apps.yml up -d
    docker-compose -f "$composeFilePath"/docker-compose-services.yml up -d
elif [ "$1" == "down" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-apps.yml -f "$composeFilePath"/docker-compose-dbs.yml stop
elif [ "$1" == "destroy" ]; then
    echo "This option will remove everything including database volumes"
    echo "Enter y/Y to -f "$composeFilePath"/docker-compose-services.yml continue"

    read -p ">> " destroy

    if [[ "$destroy" =~ ^(y|Y)$ ]]; then
        docker-compose -f "$composeFilePath"/docker-compose-services.yml -f "$composeFilePath"/docker-compose-apps.yml -f "$composeFilePath"/docker-compose-dbs.yml down -v
    fi
else
    echo "Valid options are: init, up, down, or destroy"
fi
