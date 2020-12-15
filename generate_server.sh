#!/bin/bash

GO_SOURCE_PATH="backend"

# Type of db we are using. The generator doesn't generate the interface towards the db, only its creation.
DB_TYPE="redis"

# Uses the openapi generator (https://github.com/OpenAPITools/openapi-generator) to generate a stub server using docs/openapi-specification.yaml
# Most output files are saved at GO_SOURCE_PATH/server.
set -eo pipefail

# The option --import-mappings is a small hack to use the type alias instead of pure string
docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
  -c /local/openapi/generator_config.yaml \
	-i /local/openapi/openapi-specification.yaml \
	-g go-server \
	-o /local/${GO_SOURCE_PATH} \
  --additional-properties=databaseType=${DB_TYPE} \
	--git-repo-id cyla-app --git-user-id cyla-app

# Remove the api folder where usually the api specification is saved.
rmdir "${GO_SOURCE_PATH}/api"

# openapi-generator adds some redundant dependencies. We use goimports (https://godoc.org/golang.org/x/tools/cmd/goimports) to clean those imports.
goimports -w ${GO_SOURCE_PATH}/**/*.go
	 
