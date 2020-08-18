kubectl port-forward svc/elasticsearch-coordinating-only 9200:9200 -n elastic
kubectl port-forward svc/elasticsearch-kibana 5601:5601 -n elastic
kubectl port-forward --namespace nats svc/icommerce-nats-monitoring 8222:8222