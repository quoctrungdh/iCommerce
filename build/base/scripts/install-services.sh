#!/bin/bash

services=("product" "activity" "order")
app_name="i-commerce"

root_folder=$(cd $(dirname $0); cd ..; pwd)
exec 3>&1

function _out() {
  echo "$(date +'%F %H:%M:%S') $@"
}


while getopts e: option; do
  case "${option}" in
    e) ENV=${OPTARG};;
  esac
done

for i in "${services[@]}"
do
  _out 👉 Building ${i}
  ./build/${ENV}/scripts/docker-build.sh -f ./services/${i} -n ${i}
  _out 👉 Deploying ${i}
  helm upgrade --install -n ${app_name} $i "./build/base/charts/${i}" -f "./build/${ENV}/charts/${i}/custom-values.yaml"
done