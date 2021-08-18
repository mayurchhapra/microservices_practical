
# Postgres
mkdir ${HOME}/postgres-data/

docker run --rm  -d --name dev-postgres -e POSTGRES_PASSWORD=toortoor -v ${HOME}/postgres-data/:/var/lib/postgresql/data -p 5432:5432 postgres

# In case the postgres is already available
docker start dev-postgres

# RabbitMQ
docker run -d -p 5672:5672 rabbitmq