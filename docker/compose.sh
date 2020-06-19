#!/bin/bash

composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

waitForOpenHIMCoreAPI(){
    openhimCoreIP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' openhim-core)
    echo "Waiting for OpenHIM Core API to launch on 8080..."
    until nc -z "$openhimCoreIP" 8080; do sleep 1; done
    echo "OpenHIM Core API launched"
}

if [ "$1" == "init" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-dbs.yml up -d

    # Set up the replica set
    "$composeFilePath"/initiateReplicaSet.sh

    docker-compose -f "$composeFilePath"/docker-compose-apps.yml -f "$composeFilePath"/default/docker-compose-config.yml up -d

    # Allow openhim core configuration to be applied
    waitForOpenHIMCoreAPI

    docker-compose -f "$composeFilePath"/docker-compose-services.yml up -d
elif [ "$1" == "up" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-dbs.yml up -d

    # Wait for the dbs to be properly set up and running
    sleep 20

    docker-compose -f "$composeFilePath"/docker-compose-apps.yml up -d

    # Wait for openhim to start up
    waitForOpenHIMCoreAPI

    docker-compose -f "$composeFilePath"/docker-compose-services.yml up -d
elif [ "$1" == "dev" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-dbs.yml up -d

    # Set up the replica set
    "$composeFilePath"/initiateReplicaSet.sh

    docker-compose -f "$composeFilePath"/docker-compose-apps.yml -f "$composeFilePath"/default/docker-compose-config.yml up -d

    # Allow openhim core configuration to be applied
    waitForOpenHIMCoreAPI

    docker-compose -f "$composeFilePath"/docker-compose-services.yml -f "$composeFilePath"/docker-compose-dev.yml up -d
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
