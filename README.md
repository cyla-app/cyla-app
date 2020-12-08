# Cyla

# Setup

## backend

[OpenAPI](https://editor.swagger.io/?url=https://raw.githubusercontent.com/cyla-app/cyla-app/main/openapi/openapi-specification.yaml)

1. `cd backend/`
1. `go get -d`

## frontend

[Data Model](https://editor.swagger.io/?url=https://raw.githubusercontent.com/cyla-app/cyla-app/main/openapi/frontend-spec.yaml)

1. `cd frontend`
1. `npm instal`
1. `npx react-native start`

### Inspect app preferences

Inspect encryption storage:
```bash
adb shell cat /data/data/app.cyla/shared_prefs/encryption_storage.xml
```

Inspect app storage:
```bash
adb shell cat /data/data/app.cyla/shared_prefs/app_storage.xml
```

## Docker

1. Create a `.env` file in the project root. Fill it according to `.env.example`.
1. Start all containers: `sudo docker-compose up`

### Docker Services

#### app
> Go backend with auto reloading using air

Port: 5000

#### redis

> Used as key-value database

Port: 6379

#### Inspecting database

1. First get the redis container id `docker ps`
1. Then use the id to start redis-cli: `docker exec -i -t <id> redis-cli`
1. Execute `keys *` to get all keys in redis.
1. Then use the keys to call `hgetall "<key>"`
