#!/bin/bash

COMMAND=$1
TARGET=$2

if ! [[ "$TARGET" =~ ^(docker|kubernetes|k8s)$ ]]; then
    TARGET=docker
    echo "Defaulting to docker as a target, target either not specified or invalid"
fi

if [ "$TARGET" == "docker" ]; then
    if [ "$COMMAND" == "init" ]; then
        ./docker/compose.sh init
    elif [ "$COMMAND" == "up" ]; then
        ./docker/compose.sh up
    elif [ "$COMMAND" == "down" ]; then
        ./docker/compose.sh down
    elif [ "$COMMAND" == "destroy" ]; then
        ./docker/compose.sh destroy
    else
        echo "Valid options are: init, up, down or destroy"
    fi
fi
