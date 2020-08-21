k3d cluster delete i-commerce

docker volume create local_registry
docker container run -d --name registry.localhost -v local_registry:/var/lib/registry --restart always -p 5000:5000 registry:2

k3d cluster create i-commerce \
--volume $(pwd)/build/dev/configs/k3s-registries.yaml:/etc/rancher/k3s/registries.yaml \
--k3s-server-arg '--no-deploy=traefik' \
-p 80:80@loadbalancer \
-p 443:443@loadbalancer

docker network connect k3d-i-commerce registry.localhost


# minikube delete && \
# minikube start --insecure-registry --cpus 4 --memory 8192 && \
# minikube addons enable registry && \
# docker run --rm -it --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:$(minikube ip):5000" && \
# kukebctl cluster-info