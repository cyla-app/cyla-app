<img src="./frontend/assets/app_icon.png" width="100" height="100">

# Cyla - Secure Cycle Tracking

![](./docs/screenshots/demo.gif)

> Period & ovulation information is medical data. Current period tracking apps reportedly share user data with third parties. We believe that users should be in control of their data, especially when the data gives insights into a persons health and sexual activity. We want to create an app for people who want to give birth as well as people who want to avoid pregnancy with a strong focus on privacy.

The Kanban board can be found [here](https://github.com/orgs/cyla-app/projects/1).

# Documentation

See [here](./docs/01-docs.md)

# Setup

## backend

[OpenAPI](https://editor.swagger.io/?url=https://raw.githubusercontent.com/cyla-app/cyla-app/main/openapi/openapi-specification.yaml)
[OpenAPI Login](https://editor.swagger.io/?url=https://raw.githubusercontent.com/cyla-app/cyla-app/main/openapi/login-specification.yaml)

1. `cd backend/`
1. `go get -d`

## frontend

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

Changing the server url and reset the current user can be done using adb and bash. For example to change the base url to `http://192.168.0.55`:
```bash
adb shell 'rm /data/data/app.cyla/shared_prefs/encryption_storage.xml'
adb shell "echo '<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\" ?><map><string name=\"apiBasePath\">http://192.168.0.55:5000</string></map>' > /data/data/app.cyla/shared_prefs/app_storage.xml"
```

Then restart the app completely.

## Docker

1. Create a `.env` file in the project root. Fill it according to `.env.example`.
1. Start all containers: `sudo docker-compose up`


Services:

* app (Port: 5000)
* redis (Port: 6379)

### Inspecting database

1. First get the redis container id `docker ps`
1. Then use the id to start redis-cli: `docker exec -i -t <id> redis-cli`
1. Execute `keys *` to get all keys in redis.
1. Then use the keys to call `hgetall "<key>"`
