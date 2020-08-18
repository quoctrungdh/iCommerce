#!/bin/bash

while getopts f:n: option; do
  case "${option}" in
    f) FOLDER=${OPTARG};;
    n) NAME=${OPTARG};;
  esac
done

# LOCAL
docker rmi --force registry.localhost:5000/$NAME:latest
docker build -t $NAME:latest $FOLDER --no-cache
docker tag $NAME:latest registry.localhost:5000/$NAME:latest
docker push registry.localhost:5000/$NAME:latest
