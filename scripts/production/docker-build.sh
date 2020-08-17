#!/bin/bash

while getopts f:n: option; do
  case "${option}" in
    f) FOLDER=${OPTARG};;
    n) NAME=${OPTARG};;
  esac
done

# PRODUCTION
docker rmi --force truthtaicom/$NAME:latest
docker build -t $NAME:latest $FOLDER --no-cache
docker tag $NAME:latest truthtaicom/$NAME:latest
docker push registry.localhost:5000/$NAME:latest
