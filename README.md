# iCommerce
An online shopping application which sell the products.
User can search the products they want then add to a shopping cart and proceed to place an order.
To manage and make the users satisfied, all the users' activities are related to the products such as finding, filtering, viewing detail information will be stored.

### Technologies
- [x] Docker, Kubernetes
- [x] Helm: The package manager for Kubernetes
- [x] Linkerd: An ultralight service mesh for Kubernetes
- [x] Traefik: Modern HTTP reverse proxy and load balancer
- [x] Monitoring & Observer: Grafana, Prometheus
- [x] Logging: Fluentd, Elastic Search, Kibana
- [x] Backend: Nodejs

### High level Architecture Diagram

!["Architecture Diagram"](./diagrams/iCommerce-Services.png?inline=true)

### Database Design
TDP

### Logging Design
!["Logging Design"](./diagrams/fluentd-logs.png)

### APIs
TDP

### Build and Deploy

**Prerequisites**
1. [Install Docker](https://www.docker.com/get-started)
2. [Install K3D - Minimal Kubernetes distribution ](https://k3d.io/#installation)
3. [Install Helm v3](https://helm.sh/docs/intro/install/)
4. [Install Linkerd v2](https://linkerd.io/2/getting-started/) ( from step 0 - step 3 )

5. Please copy some visual hosts to `/etc/hosts`
```
127.0.0.1   local.linkerd.i-commerce.example
127.0.0.1   local.traefik.i-commerce.example
127.0.0.1   local.api.i-commerce.example
```

**Run the application**
- Dev mode: `./build/dev/scripts/start.sh`
- Production mode: `./build/production/scripts/start.sh`

**Access/API links in LOCAL**:
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

all customers' activities such as searching, filtering and viewing product's details need to be stored in the database.