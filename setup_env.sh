#!/bin/bash

{
  echo SECRET_KEY=$SECRET_KEY
  FRONT_END_LOCATION=$FRONT_END_LOCATION
  TRUSTED_ORIGIN=$TRUSTED_ORIGIN
  DB_NAME=$DB_NAME
  DB_USER=$DB_USER
  DB_PASSWORD=$DB_PASSWORD
  DB_PORT=$DB_PORT
  EMAIL_PASSWORD=$EMAIL_PASSWORD
  ALLOWED_HOSTS=$ALLOWED_HOSTS
  REDIRECT_EMAIL_URL=$REDIRECT_EMAIL_URL
} >> .env

mkdir ./src/static/
