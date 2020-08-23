#!/bin/bash

function _out() {
  echo "$(date +'%F %H:%M:%S') $@"
}

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
# in Linux:
exp=$(date -d '+8760 hour' +"%Y-%m-%dT%H:%M:%SZ")
else
# set expiry date one year from now, in Mac:
exp=$(date -v+8760H +"%Y-%m-%dT%H:%M:%SZ")
fi

while getopts e: option; do
  case "${option}" in
    e) ENV=${OPTARG};;
  esac
done

_out 👉 Creating NameSpace
kubectl create namespace i-commerce

_out 👉 Applying ConfigMap
kubectl create -f ./build/${ENV}/configs/configMaps.yaml

_out 👉 Applying Secrets
kubectl create -f ./build/${ENV}/configs/secrets.yaml

_out 🏄‍♂️ Adding Helm repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

_out 👉 Installing Traefik
kubectl create namespace traefik
helm repo add traefik https://containous.github.io/traefik-helm-chart
helm install -n traefik -f ./build/base/charts/traefik/custom-values.yaml -f ./build/${ENV}/charts/traefik/custom-values.yaml traefik traefik/traefik
helm upgrade --install traefik-dashboard-ingress -n traefik ./build/base/charts/traefik -f ./build/${ENV}/charts/traefik/custom-values.yaml
kubectl rollout status deploy/traefik -n traefik

_out 👉 Installing Linkerd
helm upgrade --install linkerd \
  --set enforcedHostRegexp=\^\(localhost\|linkerd\.i-commerce\.example\|127\.0\.0\.1\|linkerd-web\.linkerd\.svc\.cluster\.local\|linkerd-web\.linkerd\.svc\|\[\:\:1\]\)\(:\d\+\)\?\$ \
  --set-file global.identityTrustAnchorsPEM="./build/${ENV}/charts/linkerd/certs/ca.crt" \
  --set-file identity.issuer.tls.crtPEM="./build/${ENV}/charts/linkerd/certs/issuer.crt" \
  --set-file identity.issuer.tls.keyPEM="./build/${ENV}/charts/linkerd/certs/issuer.key" \
  --set identity.issuer.crtExpiry=$exp \
  -f ./build/base/charts/nats/custom-values.yaml \
  -f ./build/${ENV}/charts/nats/custom-values.yaml \
  linkerd/linkerd2

helm upgrade --install linkerd-dashboard-ingress -n linkerd ./build/base/charts/linkerd -f ./build/${ENV}/charts/linkerd/custom-values.yaml
kubectl rollout status deploy/linkerd-web -n linkerd

_out 👉 Installing Redis
kubectl create namespace redis
helm install redis bitnami/redis -f ./build/base/charts/redis/custom-values.yaml -f ./build/${ENV}/charts/redis/custom-values.yaml -n redis
kubectl rollout status svc/redis -n redis

_out 👉 Installing Cert-Manager
helm repo add jetstack https://charts.jetstack.io
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.0.0-beta.0/cert-manager.crds.yaml
helm install --name cert-manager --namespace cert-manager jetstack/cert-manager -f ./build/base/charts/cert-manager/custom-values.yaml -f ./build/${ENV}/charts/cert-manager/custom-values.yaml
kubectl rollout status svc/cert-manager -n cert-manager

_out 👉 Installing NATS
kubectl create namespace nats
helm install icommerce-nats bitnami/nats -f ./build/base/charts/nats/custom-values.yaml -f ./build/${ENV}/charts/nats/custom-values.yaml -n nats
kubectl rollout status svc/icommerce-nats -n nats

_out 👉 Installing MongoDB
kubectl create namespace mongodb
helm install -n mongodb mongodb bitnami/mongodb -f ./build/base/charts/mongodb/custom-values.yaml -f ./build/${ENV}/charts/mongodb/custom-values.yaml
kubectl rollout status svc/mongodb-arbiter-headless -n mongodb
kubectl rollout status svc/mongodb-headless -n mongodb

_out 👉 Installing ElasticSearch
kubectl create namespace elastic
helm repo add elastic https://helm.elastic.co
helm install elasticsearch bitnami/elasticsearch -n elastic -f ./build/base/charts/elasticsearch/custom-values.yaml -f ./build/${ENV}/charts/elasticsearch/custom-values.yaml
kubectl rollout status svc/elasticsearch-kibana -n elastic
helm upgrade --install kibana-ingress -n elastic ./build/base/charts/kibana -f ./build/${ENV}/charts/kibana/custom-values.yaml

_out 👉 Installing Fluentd
kubectl create namespace fluentd
kubectl create -f ./build/${ENV}/configs/fluentd-configmap.yaml
helm install -n fluentd fluentd bitnami/fluentd -f ./build/base/charts/fluentd/custom-values.yaml -f ./build/${ENV}/charts/fluentd/custom-values.yaml
kubectl rollout status pod/fluentd-0 -n fluentd

