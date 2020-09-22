#### Gap Commerce Backend

Our backend services code.

![Testing Workflow](https://github.com/fmontada/gc-backend/workflows/Testing%20Workflow/badge.svg?branch=master)

## Initial Setup Steps

1. Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).
2. Ask an admin to create your AWS account, and you should receive the following dev AWS credentials:
    - **Admin AWS Account ID**
    - **Admin AWS Account IAM User Name**
    - **Admin AWS Account IAM Password**
    - **Dev AWS Account ID**
    - **Dev AWS Role ARN**
    - **Your IAM User Access Key ID**
    - **Your IAM User Secret Access Key**
3. Then, move onto the next section below: _AWS Credentials Configuration_

## AWS Credentials Configuration

1. Type the following command to begin configuration:

```sh
aws configure
```

-   You'll be prompted for the following:

    -   **AWS Access Key ID**
    -   **AWS Secret Access Key**
    -   **Default region name** (use `us-east-1`)
    -   **Default output format** (use `json`)

    > This will generate two AWS files (assuming you're using macOS, they're located in `~/.aws`): `config` & `credentials`

    2. Next, open the `credentials` file. It should look something like:

    ```env
    [default]
    aws_access_key_id=<YOUR_ACCESS_KEY_ID>
    aws_secret_access_key=<YOUR_SECRET_ACCESS_KEY>

    ```

## Env Configuration

-   When running make commands environment variables are obtained from AWS Parameter Store and stored in `.env`, using `ssm.js`, the paramsPath must be in the following order:
    -   Common enviroment variables that are in common hierarchy for service and workers, set path null so that the .env file is not created.
    -   Service enviroment variables that are in service hierarchy, .env is store in root.
    -   Workers common enviroment variables that are in worker hierarchy, is concatenated with common enviroment variables.
    -   Specific workers enviroment that are in specific worker hierarchy.
-   Generate env

    ```
    AWS_PROFILE=gc-dev make generate_env
    ```

-   Reference to `.env.example`

    ```
    AWS_LAMBDA_FUNCTION_NAME=gc-backend
    AWS_LAMBDA_ZIP_FILE=function.zip
    AWS_LAMBDA_LAYER_NAME=gc-backend_layer
    AWS_REGION=us-west-1
    AWS_PROFILE=gc-dev

    PORT=8000

    ```

## Deploy

-   Use the commad below to update the lambda function code

```
 AWS_PROFILE= <profile> [VERSION= <version> TAG= <version_to_rollback>] make deploy_services

 VERSION Valid Values: (Doc https://flaviocopes.com/npm-semantic-versioning/)
  major (You up the major version when you make incompatible API changes)
  minor (You up the minor version when you add functionality in a backward-compatible manner)
  patch (You up the patch version when you make backward-compatible bug fixes)

  Example: AWS_PROFILE=<profile> VERSION=patch  make deploy_services

  TAG Valid Value Example: 2.6.2
```

-   Notes
    -   If you don't specify a `VERSION` or `TAG` the last tag version will be deploy.

## Update Lambda Data Layer

-   To update the data layer we need to push a new version using the command below and go to aws console for change the version

```
 AWS_PROFILE= <profile> make deploy_layer_services
 AWS_PROFILE= <profile> make deploy_layer_worker
```

-   Lambda Data Layer Limits

    -   Total size of the Lambda deployment package with all layers unzipped should not be more than 250 MB

-   Notes

    -   Every time we add a new dependency to our project we need to update the data layer!
    -   If the `datalayer` hit the limit we need to create a new one
    -   We have to make sure the `./package.json` and `./lambda-layer/nodejs/package.json` are allways in sync !\_
