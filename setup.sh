# Create network
echo "_________ Network ____________"
docker network create net0 --driver bridge

# Postgres
echo ""
echo "-------- Postgres data ----------"
mkdir ${HOME}/postgres-data/

echo ""
echo "-------- Postgres ----------"
docker run --rm  -d --network net0 --name dev-postgres -e POSTGRES_PASSWORD=toortoor -v ${HOME}/postgres-data/:/var/lib/postgresql/data -p 5432:5432 postgres

# In case the postgres is already available
docker start dev-postgres

# RabbitMQ
docker run --rm -d --network net0 --hostname rabbitmqhost --name rabbitmq -p 5672:5672 rabbitmq

echo " ============================= Building ===================================="

echo ""
echo "-------- Building gateway ----------"
docker build -t gateway gateway/

echo ""
echo "-------- Building Microservice 1 ----------"
docker build -t m1 m1/

echo ""
echo "-------- Building Microservice 2 ----------"
docker build -t m2 m2/

echo ""
echo "-------- Building Microservice 3 ----------"
docker build -t m3 m3/

echo "================ Starting Services ============================="

echo ""
echo "-------- Start gateway ----------"
npx kill-port 3000
docker run -d --network net0  --name gateway -p 3000:3000 gateway

echo ""
echo "-------- Start Microservice 1 ----------"
npx kill-port 5001
docker run -d --network net0  --name m1 -p 5001:5001 m1

echo ""
echo "-------- Start Microservice 2 ----------"
npx kill-port 5002
docker run -d --network net0  --name m2 -p 5002:5002 m2

echo ""
echo "-------- Start Microservice 3 ----------"
npx kill-port 5003
docker run -d --network net0  --name m3 -p 5003:5003 m3
