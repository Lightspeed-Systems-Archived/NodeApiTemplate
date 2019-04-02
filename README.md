# NodeApiTemplate
This project provides a template for creating a Node-based API using JWT for authentication. It connects directly to DynamoDB for authentication.

## First Things First

Don't commit to this repo. Instead, clone the `master` branch to your local computer and delete the root `.git` folder. Then update the `package.json` to reflect your project.

## The Basics

This project runs on NodeJS. You're going to want to make sure you have at least version 8.10.0 installed. In addition, you're going to need a linter installed on your editor, and be prepared to write tests. This is *non-negotiable*.

In order to install the necessary node modules for testing, run `npm install`. To run the tests, use command `npm test`.

## Deploying

1. Create a new Lambda function from the `microservice-http-endpoint` blueprint.
  a. Name the function based on the github repository for clarity, eg `classroom-api`
  a. Choose to `create a new role from AWS policy templates` and name it based on the github repository, eg `classroom-api-executor`.
  a. Make sure the `Basic Lambda@Edge permissions (for CloudFront trigger)` policy template is selected.
  a. For the API Gateway Trigger, select `Create a new API` with Security set to `Open with API Key` (you'll need to get the API key from API Gateway after creation), and enable metrics and error logging under Additional Settings.
1. Go to to IAM Management -> Roles in AWS and navigate to the newly created Roles
  a. Choose `Attach Policy` and find the RelayResources policy to attach.
1. Update `claudia.json`
  a. Update `lambda -> role` with the name of the role you created (eg `classroom_api-executor`).
  a. Update `lambda -> name` with the name of the function itself (eg `classroom-api`).
  a. Update `api -> id` with the id of the API Gateway, which you can find by navigating to Amazon API Gateway in AWS, clicking your freshly made API, and copying it from inside the paranthesis in the breadcrumbs (eg if the page header contains `relay-co-api (gm4nyg31l2)` the id is `gm4nyg31l2`)
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
