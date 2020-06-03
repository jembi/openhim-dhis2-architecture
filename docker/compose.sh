composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$1" == "init" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-dbs.yml up -d

    # Set up the replica set
    "$composeFilePath"/initiateReplicaSet.sh

    docker-compose -f "$composeFilePath"/docker-compose-apps.yml up -d
elif [ "$1" == "up" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-dbs.yml -f "$composeFilePath"/docker-compose-apps.yml up -d
elif [ "$1" == "down" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-apps.yml -f "$composeFilePath"/docker-compose-dbs.yml stop
elif [ "$1" == "destroy" ]; then
    docker-compose -f "$composeFilePath"/docker-compose-apps.yml -f "$composeFilePath"/docker-compose-dbs.yml down -v
else
    echo "Valid options are: init, up, down, or destroy"
fi
