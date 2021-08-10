#!/bin/sh

EXPORT_VARS_FILES=${EXPORT_VARS_FILES:-true}
if [ "${EXPORT_VARS_FILES}" == "true" ]; then
  if [ -d /vault/secrets ]; then for i in $(ls -1 /vault/secrets); do source /vault/secrets/$i; done; fi
fi

node dist/main.js
