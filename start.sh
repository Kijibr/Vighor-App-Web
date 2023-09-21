#!/usr/bin/env sh

# path inside the container
FILE_PATH="/var/www/settings.js"

# if running locally
if [ "$1" = "local" ]; then
	FILE_PATH="./public/settings.js"
	INPUT_FILE="./.env"

	# delete in-use settings if exists
	if test -f "$FILE_PATH"; then
		rm $FILE_PATH
	fi

	# Check if the file contains blank line in the end
	if [ -n "$(tail -c1 $INPUT_FILE)" ]; then
		echo "" >> $INPUT_FILE
	fi

	echo "window._env_ = {" >> "${FILE_PATH}"

	while read -r line; do
		# Separates the key and the value in separate variables
		key=$(echo $line | cut -d '=' -f 1)
		value=$(echo $line | cut -d '=' -f 2-)

		# Write the line in to file of exit in wanted format
		echo "  $key: '$value'," >> "${FILE_PATH}"
	done < $INPUT_FILE
	
	echo "};" >> "${FILE_PATH}"

	yarn run dev
		
	exit 0
fi

# delete in-use settings if exists
if test -f "$FILE_PATH"; then
	rm $FILE_PATH
fi

# copy the proper env vars
echo "window._env_ = {" >> "${FILE_PATH}"

{
echo "  BASE_API: '$BASE_API',"
# echo "  DATA_BASE_NAME: '$DATA_BASE_NAME',"
# echo "  BASF_AUTH_TOKEN_URL: '$BASF_AUTH_TOKEN_URL',"
# echo "  BASF_FEDERATION_ENVIRONMENT: '$BASF_FEDERATION_ENVIRONMENT',"
} >> "${FILE_PATH}"

echo "};" >> "${FILE_PATH}"

# run nginx on foreground (daemon off) so docker is attached to one process only (best pratice)
nginx -g 'daemon off;'