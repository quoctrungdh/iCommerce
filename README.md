# iCommerce
An online shopping application which sell the products.
User can search the products they want then add to a shopping cart and proceed to place an order.
To manage and make the users satisfied, all the users' activities are related to the products such as finding, filtering, viewing detail information will be stored.

### Technologies
- [x] **Container Orchestration Engine**: Kubernetes - Docker
- [x] **The package manager for Kubernetes**: Helm
- [x] **Service mesh for Kubernetes**: Linkerd
- [x] **Reverse proxy and load balancer**: Traefik
- [x] **Monitoring & Observer**: Grafana, Prometheus
- [x] **Logging**: Fluentd, Elastic Search, Kibana
- [x] **Message System**: NATS
- [x] **Database**: MongoDB
- [x] **Backend**: NodeJS

### Features
- [x] Auto Horizontal Scaling
- [x] Auto Load Balancing
- [x] Router Rules
- [x] Service Mesh
- [x] Service Discovery
- [x] Message Queue
- [x] Monitoring & Observer
- [x] Virtualizing Centralized Logging
- [ ] High Availability

### High level Architecture Diagram

!["Architecture Diagram"](./diagrams/iCommerce-Services.png?inline=true)

### Database Design
!["Database Design"](./diagrams/mongodb-multitier.png)

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

**Run the application**
- Dev mode: `./build/dev/scripts/start.sh`
- Production mode: `./build/production/scripts/start.sh`

**For Dev Mode**
Please copy some visual hosts to `/etc/hosts`
```
127.0.0.1   api.i-commerce.example
127.0.0.1   kibana.i-commerce.example
127.0.0.1   traefik.i-commerce.example
```
**Access/API links for DEV Mode**:
- Traefik Dashboard: http://traefik.i-commerce.example
- Kibana: http://kibana.i-commerce.example
- Product API: http://api.i-commerce.example/product
- Activity API: http://api.i-commerce.example/activity
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