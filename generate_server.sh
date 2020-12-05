#!/bin/bash

# Uses the openapi generator (https://github.com/OpenAPITools/openapi-generator) to generate a stub server using docs/openapi-specification.yaml
# Most output files are saved at backend/server, except the generated main.go.
set -eo pipefail

docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
	-i /local/openapi/openapi-specification.yaml \
	-g go-server \
	-t /local/openapi/go-server_templates \
	-o /local/backend \
	--git-repo-id cyla-app --git-user-id cyla-app \
	--package-name server \
	--additional-properties=serverPort=5000,sourceFolder=server

# openapi-generator add some redundant dependencies. We use goimports (https://godoc.org/golang.org/x/tools/cmd/goimports) to clean those imports.
goimports -w backend/**/*.go
# Remove the api folder where usually the api specification is saved.
rmdir backend/api

	 
