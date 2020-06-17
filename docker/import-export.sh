#!/bin/bash

COMMAND=$1
TARGET=$2

VALID_OPTIONS="dhis2|openhim|validator-orchestrator|populator|file-queue|facility-cache|all"

if ! [[ "$TARGET" =~ ^($VALID_OPTIONS)$ ]]; then
    TARGET='all'
    echo "Defaulting to 'all' as a target was not specified or invalid"
    echo "Target options: $VALID_OPTIONS"
fi

composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$COMMAND" == "import" ]; then
    if [[ "$TARGET" =~ ^(dhis2|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/dhis2/docker-compose.importer.dhis2.yml up
    fi

    if [[ "$TARGET" =~ ^(openhim|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/openhim/docker-compose.importer.openhim.yml up
    fi

    if [[ "$TARGET" =~ ^(validator-orchestrator|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/validator-orchestrator/docker-compose.importer.validator-orchestrator.yml up
    fi

    if [[ "$TARGET" =~ ^(populator|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/populator/docker-compose.importer.populator.yml up
    fi

    if [[ "$TARGET" =~ ^(file-queue|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/file-queue/docker-compose.importer.file-queue.yml up
    fi

    if [[ "$TARGET" =~ ^(facility-cache|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/facility-cache/docker-compose.importer.facility-cache.yml up
    fi
elif [ "$COMMAND" == "export" ]; then
    if [[ "$TARGET" =~ ^(dhis2|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/dhis2/docker-compose.exporter.dhis2.yml up
    fi

    if [[ "$TARGET" =~ ^(openhim|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/openhim/docker-compose.exporter.openhim.yml up
    fi

    if [[ "$TARGET" =~ ^(validator-orchestrator|all)$ ]]; then
        echo "No export option yet for the Validator Orchestrator Mediator"
    fi

    if [[ "$TARGET" =~ ^(populator|all)$ ]]; then
        echo "No export option yet for the Populator Mediator"
    fi

    if [[ "$TARGET" =~ ^(file-queue|all)$ ]]; then
        echo "No export option yet for the File Queue Mediator"
    fi

    if [[ "$TARGET" =~ ^(facility-cache|all)$ ]]; then
        echo "No export option yet for the Faciliy Cache Mediator"
    fi
elif [ "$COMMAND" == "destroy" ]; then
    if [[ "$TARGET" =~ ^(dhis2|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/dhis2/docker-compose.exporter.dhis2.yml down -v
        docker-compose -f "$composeFilePath"/import-export/dhis2/docker-compose.importer.dhis2.yml down -v
    fi

    if [[ "$TARGET" =~ ^(openhim|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/openhim/docker-compose.exporter.openhim.yml down -v
        docker-compose -f "$composeFilePath"/import-export/openhim/docker-compose.importer.openhim.yml down -v
    fi

    if [[ "$TARGET" =~ ^(validator-orchestrator|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/validator-orchestrator/docker-compose.importer.validator-orchestrator.yml down -v
    fi

    if [[ "$TARGET" =~ ^(populator|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/populator/docker-compose.importer.populator.yml down -v
    fi

    if [[ "$TARGET" =~ ^(file-queue|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/file-queue/docker-compose.importer.file-queue.yml down -v
    fi

    if [[ "$TARGET" =~ ^(facility-cache|all)$ ]]; then
        docker-compose -f "$composeFilePath"/import-export/facility-cache/docker-compose.importer.facility-cache.yml down -v
    fi
else
    echo "Valid command options are: import, export, or destroy"
fi
