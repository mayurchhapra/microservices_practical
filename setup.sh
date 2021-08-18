docker network create genea

# Postgres
mkdir ${HOME}/postgres-data/

docker run --net=genea --rm  -d --name dev-postgres -e POSTGRES_PASSWORD=toortoor -v ${HOME}/postgres-data/:/var/lib/postgresql/data -p 5432:5432 postgres

# In case the postgres is already available
docker start dev-postgres

# RabbitMQ
docker run --net=genea -d -p 5672:5672 rabbitmq

docker build -t gateway gateway/
docker build -t m1 m1/
docker build -t m2 m2/
docker build -t m3 m3/