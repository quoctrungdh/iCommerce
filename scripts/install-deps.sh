function _out() {
  echo "$(date +'%F %H:%M:%S') $@"
}

_out 👉 Creating NameSpace
kubectl create namespace i-commerce

_out 👉 Applying ConfigMap
kubectl create -f ./configs/configMaps.yaml
kubectl create -f ./configs/fluentd-configmap.yaml
kubectl create -f ./configs/logs-parser.yaml

_out 👉 Applying Secrets
kubectl create -f ./configs/secrets.yaml


_out 🏄‍♂️ Adding Helm repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

_out 👉 Installing Traefik
kubectl create namespace traefik
helm repo add traefik https://containous.github.io/traefik-helm-chart
helm install -n traefik -f ./charts/traefik/custom-values.yaml traefik traefik/traefik
kubectl rollout status deploy/traefik -n traefik

_out 👉 Installing NATS
kubectl create namespace nats
helm install icommerce-nats bitnami/nats -f ./charts/nats/custom-values.yaml -n nats
kubectl rollout status svc/icommerce-nats-client -n nats

_out 👉 Installing MongoDB
kubectl create namespace mongodb
helm install -n mongodb mongodb bitnami/mongodb -f ./charts/mongodb/custom-values.yaml
kubectl rollout status svc/mongodb-arbiter-headless -n mongodb
kubectl rollout status svc/mongodb-headless -n mongodb

_out 👉 Installing ElasticSearch
kubectl create namespace elastic
helm repo add elastic https://helm.elastic.co
helm install elasticsearch bitnami/elasticsearch -n elastic -f ./charts/elasticsearch/custom-values.yaml
kubectl rollout status svc/elasticsearch -n elastic

_out 👉 Installing Fluentd
kubectl create namespace fluentd

helm install -n fluentd fluentd bitnami/fluentd \
-f ./charts/fluentd/custom-values.yaml \
--set aggregator.configMap=elasticsearch-output \
--set forwarder.configMap=log-parser \
--set aggregator.extraEnv\[0\].name=ELASTICSEARCH_HOST \
--set aggregator.extraEnv\[0\].value=elasticsearch-coordinating-only.elastic.svc.cluster.local \
--set aggregator.extraEnv\[1\].name=ELASTICSEARCH_PORT \
--set-string aggregator.extraEnv\[1\].value=9200
  # -f ./charts/fluentd/custom-values.yaml
kubectl rollout status pods/fluentd-0 -n fluentd