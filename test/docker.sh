#!/bin/bash

PROJECT_NAME=metrics_reporter

BASE_DIR=$(dirname $0)

set -e

docker-compose -p $PROJECT_NAME -f ${BASE_DIR}/docker-compose.yaml down --rmi 'local' --volumes --remove-orphans

docker-compose -p $PROJECT_NAME -f ${BASE_DIR}/docker-compose.yaml up -d influxdb

until docker-compose -p $PROJECT_NAME -f ${BASE_DIR}/docker-compose.yaml exec influxdb curl -i -XPOST "http://localhost:8086/query" --data-urlencode "q=CREATE DATABASE app_metrics"; do
  echo "waiting for influxdb to start.."
done
