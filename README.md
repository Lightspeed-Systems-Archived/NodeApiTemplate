# NodeApiTemplate
This project provides a template for creating a Node-based API using JWT for authentication. It connects directly to DynamoDB for authentication.

## First Things First

Don't commit to this repo. Instead, clone the `master` branch to your local computer and delete the root `.git` folder. Then update the `package.json` to reflect your project.

## The Basics

This project runs on NodeJS. You're going to want to make sure you have at least version 8.10.0 installed. In addition, you're going to need a linter installed on your editor, and be prepared to write tests. This is *non-negotiable*.

In order to install the necessary node modules for testing, run `npm install`. To run the tests, use command `npm test`.

## Deploying

1. Update `claudia.json` with the correct role, name, and api id.
1. Install Claudia globally (`npm install -g claudia`).
1. Deploy from the project root directory with `./deploy.sh development`.

## Required Environment Variables (with examples!)

```
JWT_SECRET=somerandomstring
LAMBDA_ENV=development
RELAY_LOG_LEVEL=debug
GOOGLE_SECRET=somerandomstring
AZURE_CLIENT_ID=a-client-id
AZURE_CLIENT_SECRET=somerandomstring
```

## Dynamo DB

```
Needs read access to the users-{$env} table
```
