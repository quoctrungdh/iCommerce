#!/bin/bash

services=("product" "activity")
app_name="i-commerce"

root_folder=$(cd $(dirname $0); cd ..; pwd)
exec 3>&1

function _out() {
  echo "$(date +'%F %H:%M:%S') $@"
}

for i in "${services[@]}"
do
  _out 👉 Building ${i}
  ./build/dev/scripts/docker-build.sh -f ./services/${i} -n ${i}
  _out 👉 Deploying ${i}
  helm upgrade --install -n ${app_name} $i ./build/base/charts/${i} -f ./build/dev/charts/${i}/custom-values.yaml
done



