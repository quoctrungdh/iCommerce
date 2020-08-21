#!/bin/bash

registry="registry.localhost:5000"

while getopts f:n: option; do
  case "${option}" in
    f) FOLDER=${OPTARG};;
    n) NAME=${OPTARG};;
  esac
done

# LOCAL
docker rmi --force ${registry}/$NAME:latest
docker build -t $NAME:latest $FOLDER --no-cache
docker tag $NAME:latest ${registry}/$NAME:latest
docker push ${registry}/$NAME:latest
