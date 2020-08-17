#!/bin/bash

services=("product")
app_name="i-commerce"

root_folder=$(cd $(dirname $0); cd ..; pwd)
exec 3>&1

function _out() {
  echo "$(date +'%F %H:%M:%S') $@"
}

for i in "${services[@]}"
do
  _out 👉 Building ${i}
  ./scripts/local/docker-build.sh -f ./services/${i} -n ${i}
  _out 👉 Deploying ${i}
  helm upgrade --install -n ${app_name} $i ./charts/${i}
done



