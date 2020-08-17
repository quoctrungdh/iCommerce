# iCommerce
An online shopping application to sell their products

### High level Architecture Diagram

!["Architecture Diagram"](./iCommerce-Services.png?inline=true)

### Database Design


### Technologies
- [x] Docker, Kubernetes
- [x] Helm: The package manager for Kubernetes
- [x] Linkerd: An ultralight service mesh for Kubernetes
- [x] Traefik: Modern HTTP reverse proxy and load balancer
- [x] Monitoring & Observer: Grafana, Prometheus
- [x] Logging: Fluentd, Elastic Search, Kibana
- [x] Backend: Nodejs

This application use ["Cloud Native Computing Foundation"](https://landscape.cncf.io/) Applications
===========================================================

### To start all services with Kubernetes
1. [Install Docker](https://www.docker.com/get-started)
2. [Install K3D - Minimal Kubernetes distribution ](https://k3d.io/#installation)
3. [Install Helm v3](https://helm.sh/docs/intro/install/)
4. [Install Linkerd v2](https://linkerd.io/2/getting-started/) ( from step 0 - step 3 )

4. Please copy some visual hosts to `/etc/hosts`
```
127.0.0.1   local.linkerd.i-commerce.example
127.0.0.1   local.traefik.i-commerce.example
127.0.0.1   local.api.i-commerce.example
```

5. Create file `./global-values.yaml` contains:
```
appNamespace: i-commerce
appLinkerdDomain: local.linkerd.i-commerce.example
appTraefikDomain: local.traefik.i-commerce.example
appApiDomain: local.api.i-commerce.example
```

6. Create file `./configs/secrets.yaml` contains:
```
apiVersion: v1
kind: Secret
metadata:
  name: db-env
  namespace: i-commerce
type: Opaque
stringData:
  MONGO_SERVER: <your-mongo-server>
  MONGO_DB: <your-mongo-db>
```

7. Create file `./configs/configMaps.yaml` contains:
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: global-env
  namespace: i-commerce
data:
  MONGO_COLLECTION_PRODUCTS: products
  MONGO_COLLECTION_FILES: files
  MONGO_COLLECTION_ACTIVITIES: activities
  PORT: "8080"
```

8. Run: `./scripts/start.sh`

### Access/API links in LOCAL:
- Linkerd Dashboard: http://local.linkerd.i-commerce.example
- Traefik Dashboard: http://local.traefik.i-commerce.example
- API: http://local.api.i-commerce.example
==========================================

**👉 IMPORTANT: You can use [POSTMAN](https://www.postman.com/downloads/) to call your API**

Elastic Search:
```
kubectl port-forward --namespace elastic svc/elasticsearch-coordinating-only 9200:9200 &
    curl http://127.0.0.1:9200/
```

Kibana:
```
kubectl port-forward --namespace elastic svc/elasticsearch-kibana 5601:5601 &
    curl http://127.0.0.1:9200/
```

