#!/bin/bash

GO_SOURCE_PATH="backend"

# Name for the package and location of the generated server stub
GEN_GO_PACKAGE_NAME="server"

# Uses the openapi generator (https://github.com/OpenAPITools/openapi-generator) to generate a stub server using docs/openapi-specification.yaml
# Most output files are saved at GO_SOURCE_PATH/server.
set -eo pipefail

docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
	-i /local/openapi/openapi-specification.yaml \
	-g go-server \
	-t /local/openapi/go-server_templates \
	-o /local/${GO_SOURCE_PATH} \
	--git-repo-id cyla-app --git-user-id cyla-app \
	--package-name ${GEN_GO_PACKAGE_NAME} \
	--import-mappings EncryptedAttribute=server.EncryptedAttribute,Date=server.Date \
	--additional-properties=serverPort=5000,sourceFolder=${GEN_GO_PACKAGE_NAME}

# Remove the api folder where usually the api specification is saved.
rmdir "${GO_SOURCE_PATH}/api"

# openapi-generator adds some redundant dependencies. We use goimports (https://godoc.org/golang.org/x/tools/cmd/goimports) to clean those imports.
goimports -w ${GO_SOURCE_PATH}/**/*.go
	 
