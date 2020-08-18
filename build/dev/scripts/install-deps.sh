function _out() {
  echo "$(date +'%F %H:%M:%S') $@"
}

_out 👉 Creating NameSpace
kubectl create namespace i-commerce

_out 👉 Applying ConfigMap
kubectl create -f ./build/dev/configs/configMaps.yaml

_out 👉 Applying Secrets
kubectl create -f ./build/dev/configs/secrets.yaml


_out 🏄‍♂️ Adding Helm repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

_out 👉 Installing Traefik
kubectl create namespace traefik
helm repo add traefik https://containous.github.io/traefik-helm-chart
helm install -n traefik -f ./build/base/charts/traefik/custom-values.yaml -f ./build/dev/charts/traefik/custom-values.yaml traefik traefik/traefik
kubectl rollout status deploy/traefik -n traefik

_out 👉 Installing NATS
kubectl create namespace nats
helm install icommerce-nats bitnami/nats -f ./build/base/charts/nats/custom-values.yaml -f ./build/dev/charts/nats/custom-values.yaml -n nats
kubectl rollout status svc/icommerce-nats-client -n nats

_out 👉 Installing MongoDB
kubectl create namespace mongodb
helm install -n mongodb mongodb bitnami/mongodb -f ./build/base/charts/mongodb/custom-values.yaml -f ./build/dev/charts/mongodb/custom-values.yaml
kubectl rollout status svc/mongodb-arbiter-headless -n mongodb
kubectl rollout status svc/mongodb-headless -n mongodb

_out 👉 Installing ElasticSearch
kubectl create namespace elastic
helm repo add elastic https://helm.elastic.co
helm install elasticsearch bitnami/elasticsearch -n elastic -f ./build/base/charts/elasticsearch/custom-values.yaml -f ./build/dev/charts/elasticsearch/custom-values.yaml
kubectl rollout status svc/elasticsearch -n elastic

_out 👉 Installing Fluentd
kubectl create namespace fluentd
kubectl create -f ./build/dev/configs/fluentd-configmap.yaml
helm install -n fluentd fluentd bitnami/fluentd -f ./build/base/charts/fluentd/custom-values.yaml -f ./build/dev/charts/fluentd/custom-values.yaml
kubectl rollout status pod/fluentd-0 -n fluentd
