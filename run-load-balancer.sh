docker build --tag fredy-load-balancer:latest .
docker run --name fredy_load_balancer -d -p 80:80 fredy-load-balancer