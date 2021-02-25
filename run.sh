#!/bin/bash

NAMESPACE=$ENVIRONMENT
GCLOUD=gcloud
export  TWILIO_ACCOUNT_SID=$(gcloud secrets versions access latest \
   --secret="${PROJECT}-${NAMESPACE}-chatbot-twilio-account-sid")
export  TWILIO_AUTH_TOKEN=$(gcloud secrets versions access latest \
   --secret="${PROJECT}-${NAMESPACE}-chatbot-twilio-auth-token")
export  REDIS_PASS=$($GCLOUD secrets versions access latest \
   --secret="${PROJECT}-${NAMESPACE}-chatbot-twilio-redis-pass")

cd /usr/src/app
npm run start