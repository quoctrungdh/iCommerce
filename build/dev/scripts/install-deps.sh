envName="dev"

function _out() {
  echo "$(date +'%F %H:%M:%S') $@"
}

_out 👉 Creating NameSpace
kubectl create namespace i-commerce

_out 👉 Applying ConfigMap
kubectl create -f ./build/${envName}/configs/configMaps.yaml

_out 👉 Applying Secrets
kubectl create -f ./build/${envName}/configs/secrets.yaml

_out 🏄‍♂️ Adding Helm repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# _out 👉 Installing Linkerd Ingress
# linkerd install | kubectl apply -f -
# linkerd check
# helm upgrade --install linkerd-dashboard-ingress -n linkerd ./build/base/charts/linkerd  -f ./build/${envName}/charts/linkerd/custom-values.yaml

_out 👉 Installing Traefik
kubectl create namespace traefik
helm repo add traefik https://containous.github.io/traefik-helm-chart
helm install -n traefik -f ./build/base/charts/traefik/custom-values.yaml -f ./build/${envName}/charts/traefik/custom-values.yaml traefik traefik/traefik
helm upgrade --install traefik-dashboard-ingress -n traefik ./build/base/charts/traefik -f ./build/${envName}/charts/traefik/custom-values.yaml
kubectl rollout status deploy/traefik -n traefik

_out 👉 Installing NATS
kubectl create namespace nats
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm install icommerce-nats nats/nats --version 0.5.0 -f ./build/base/charts/nats/custom-values.yaml -f ./build/${envName}/charts/nats/custom-values.yaml -n nats
kubectl rollout status svc/icommerce-nats -n nats

_out 👉 Installing MongoDB
kubectl create namespace mongodb
helm install -n mongodb mongodb bitnami/mongodb -f ./build/base/charts/mongodb/custom-values.yaml -f ./build/${envName}/charts/mongodb/custom-values.yaml
kubectl rollout status svc/mongodb-arbiter-headless -n mongodb
kubectl rollout status svc/mongodb-headless -n mongodb

_out 👉 Installing ElasticSearch
kubectl create namespace elastic
helm repo add elastic https://helm.elastic.co
helm install elasticsearch bitnami/elasticsearch -n elastic -f ./build/base/charts/elasticsearch/custom-values.yaml -f ./build/${envName}/charts/elasticsearch/custom-values.yaml
kubectl rollout status svc/elasticsearch-kibana -n elastic
helm upgrade --install kibana-ingress -n elastic ./build/base/charts/kibana -f ./build/${envName}/charts/kibana/custom-values.yaml

_out 👉 Installing Fluentd
kubectl create namespace fluentd
kubectl create -f ./build/${envName}/configs/fluentd-configmap.yaml
helm install -n fluentd fluentd bitnami/fluentd -f ./build/base/charts/fluentd/custom-values.yaml -f ./build/${envName}/charts/fluentd/custom-values.yaml
kubectl rollout status pod/fluentd-0 -n fluentd
