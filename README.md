# Cyla

# Setup

## backend

1. `cd backend/`
2. `go get` (ignore errors)

## frontend

1. `cd frontend`
2. `npm instal`
2. `npx react-native start`

## Docker

1. Build docker container: `sudo docker build backend/air_with_dependencies --tag air_with_dependencies:v1.15.1`
2. Start all containers: `sudo docker-compose up`


### Docker Services

#### go
> Go backend with auto reloading using air

Port: 5000

#### db
> PostgreSQL database

Port: default

#### adminer
> DB inspection tool

Port: 8080

To login use the following settings (PW is postgres):

![](./docs/adminer_login.png)
