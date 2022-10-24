# Cumulus Dashboard

Code to generate and deploy the dashboard for the Cumulus API.

## Documentation

- [Configuration](#configuration)
- [Quick start](#quick-start)
- [Dashboard development](#dashboard-development)
- [Run the dashboard](#run-the-dashboard)
- [Deployment](#deployment)
- [Testing](#testing)
- [Create a Dashboard Release](#create-a-dashboard-release)


Other pages:
- [Usage](https://github.com/nasa/cumulus-dashboard/blob/master/USAGE.md)
- [Development Guide](https://github.com/nasa/cumulus-dashboard/blob/master/DEVELOPMENT.md)
- [Technical documentation on tables](https://github.com/nasa/cumulus-dashboard/blob/master/TABLES.md)

## Configuration

The dashboard is populated from data retrieved from the Cumulus API. The environment for the Cumulus API must be predetermined and set before the dashboard can be built and deployed. The information needed to configure the dashboard is found in `app/src/js/config/config.js`, but it is generally preferred to set environmental variables overriding the default values during the build process.

Setting the following environment variables can override the default values.

| Env Name | Description | Default |
|----------|-------------|---------|
| APIROOT | The API URL. This must be set by the user. | *example.com* |
| AUTH_METHOD | The type of authorization method protecting the Cumulus API. [launchpad or earthdata] | *earthdata*   |
| AWS\_REGION | Region in which Cumulus API is running. | *us-west-2*   |
| DAAC\_NAME | An identifier: e.g. LPDAAC, | *Local* |
| ENABLE\_RECOVERY | If true, adds recovery options to the granule and collection pages. | *false* |
| HIDE\_PDR | Whether to hide (or show) the PDR menu. | *true* |
| LABELS | Choose `gitc` or `daac` localization. | *daac* |
| STAGE | Identifier displayed at top of dashboard page: e.g. PROD, UAT | *development* |
| KIBANAROOT | \<optional\>  Points to a Kibana endpoint. | |


## Quick start

### Get dashboard source code
The dashboard source is available on github and can be cloned with git.

```bash
  $ git clone https://github.com/nasa/cumulus-dashboard
```
The cloned directory `./cumulus-dashboard` will be referred as the root directory of the project and commands that are referenced in this document, should start from that directory.

### Build the dashboard using Docker and Docker Compose

It is easy to build a production-ready, deployable version of the Cumulus dashboard without having to learn the complicated build process details.  A single script, `./bin/build_dashboard_via_docker.sh`, when combined with your dashboard's environment customizations, allows you to run the entire build process within a Docker container.

All of the environment variables in the [configuration](#configuration) section are available to override with custom values for your dashboard.  A recommended method is to store your variables in a source-able environment file for each dashboard you are going to build and deploy.

If you are using bash, export the values for each configuration option. An example `production.env` could look like:
```sh
# production.env
export APIROOT=https://afakeidentifier.cloudfront.net
export DAAC_NAME=MY-DAAC
export STAGE=production
export HIDE_PDR=false
```

All values are optional except `APIROOT` which must point to the Cumulus API that the dashboard will connect to.

Set the environment and build the dashboard with these commands:
```sh
  $ source production.env && ./bin/build_dashboard_via_docker.sh
```

This script uses Docker Compose to build and copy the compiled dashboard into the `./dist` directory. You can now deploy this directory to AWS behind [CloudFront](https://aws.amazon.com/cloudfront/).  If you are in NGAP, follow the instructions for "Request Public or Protected Access to the APIs and Dashboard" on the earthdata wiki page [Using Cumulus with Private APIs](https://wiki.earthdata.nasa.gov/display/CUMULUS/Cumulus+Deployments+in+NGAP).


### Run the dashboard locally via Docker Image

You can also create a Docker container that will serve the dashboard behind a simple nginx configuration. Having a runnable Docker image is useful for testing a build before deployment or for NGAP Sandbox environments, where if you configure your computer to [access Cumulus APIs via SSM](https://wiki.earthdata.nasa.gov/display/CUMULUS/Accessing+Cumulus+APIs+via+SSM), you can run the dashboard container locally against the live Sandbox Cumulus API.

The script `./bin/build_dashboard_image.sh` will build a docker image containing the dashboard bundle served behind a basic [nginx](https://www.nginx.com/) configuration. The script takes one optional parameter, the tag to name the generated image which defaults to cumulus-dashboard:latest.  The same customizations as described in the [previous section](#build-the-dashboard-using-docker-and-docker-compose) are available to configure your dashboard.

Example of building and running the project in Docker:
```bash
  $ source production.env && ./bin/build_dashboard_image.sh cumulus-dashboard:production-1
```

That command builds a Docker image with the name `cumulus-dashboard` and tag `production-1`. This image can be run in Docker to serve the Dashboard.

```bash
  $ docker run --rm -it -p 3000:80 cumulus-dashboard:production-1
```
In this example, the dashboard would be available at `http://localhost:3000/` in any browser.

--------

## Dashboard Development

### Build the dashboard

The dashboard uses node v14.19.1. To build/run the dashboard on your local machine, install [nvm](https://github.com/creationix/nvm) and run `nvm install v14.19.1`.

#### install requirements
We use npm for local package management, run `npm install -g npm@8.6.0` to install npm 8.6.0. To install the requirements:
```bash
  $ nvm use
  $ npm ci
```

Use `$ npm install` when package.json is updated.

To build a dashboard bundle<sup>[1](#bundlefootnote)</sup>:

```bash
  $ nvm use
  $ [SERVED_BY_CUMULUS_API=true] [DAAC_NAME=LPDAAC] [STAGE=production] [HIDE_PDR=false] [LABELS=daac] APIROOT=https://myapi.com npm run build
```
**NOTE**: Only the `APIROOT` environment variable is required and any of the environment variables currently set are passed to the build.

The compiled dashboard files (dashboard bundle) will be placed in the `./dist` directory.

#### Build dashboard to be served by CloudFront

If you wish to serve the dashboard from behind [CloudFront](https://aws.amazon.com/cloudfront/).  Build a `dist` with your configuration including `APIROOT` and ensure the `SERVED_BY_CUMULUS_API` variable is unset. For NGAP users, follow the documentation to *Request Public or Protected Access to the APIs and Dashboard*, Step 5 of [Cumulus Deployments in NGAP](https://wiki.earthdata.nasa.gov/display/CUMULUS/Cumulus+Deployments+in+NGAP).

#### Build dashboard to be served by the Cumulus API.

It is possible to [serve the dashboard](https://nasa.github.io/cumulus-api/#serve-the-dashboard-from-a-bucket) with the Cumulus API. If you need to do this, you must build the dashboard with the environment variable `SERVED_BY_CUMULUS_API` set to `true`.  This configures the dashboard to work from the Cumulus `dashboard` endpoint.  This option should **only** be considered when you can't serve the dashboard from behind CloudFront, for example in an NGAP Sandbox environment. *NOTE: Your dashboard bucket must be in the bucket definitions in your Cumulus `terraform.tfvars`, otherwise you will not be able to access the bucket from the API.*


#### Build a specific dashboard version

`cumulus-dashboard` versions are distributed using tags in GitHub. You can select specific version in the following manner:

```bash
  $ git clone https://github.com/nasa/cumulus-dashboard
  $ cd cumulus-dashboard
  $ git fetch origin ${tagNumber}:refs/tags/${tagNumber}
  $ git checkout ${tagNumber}
```

Then follow the steps noted above to build the [dashboard locally](#build-the-dashboard) or [using Docker](#quick-start).

It is also possible to visit the repository at https://github.com/nasa/cumulus-dashboard/releases and download the source code bundle directly without cloning the repository.

## Run the dashboard

### Run the dashboard with hot reload
During development you can run the webpack development webserver to serve the dashboard while you are developing. When you run the dashboard this way, the compiled code in `./dist` is ignored, and the source code is served by the webpack-dev-server, which will watch for changes to the source and recompile as files are changed. Make sure you have [installed the requirements](#install-requirements) and then:

```bash
APIROOT=http://<myapi>.com npm run serve
```
The dashboard should be available at http://localhost:3000

### Run a built dashboard

To run a built dashboard, first [build the dashboard](#build-the-dashboard), then run:

```bash
  $ npm run serve:prod
```
This runs a node http-server in front of whatever exists in the `./dist` directory.  It's fast, but will not pick up any changes as you are working.

## Deployment

### Using S3

First, [build the dashboard](#build-the-dashboard). Then deploy the `./dist` folder, the dashboard bundle, to an AWS bucket.

```bash
  $ aws s3 sync dist s3://my-bucket-to-be-used
```
If you are not in an NGAP environment, Look at the instructions for [Hosting a static website on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)
and [configuring a bucket as a static website](https://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html).

Otherwise, follow the instructions for building and deploying the dashboard for [cloudfront](#build-dashboard-to-be-served-by-cloudfront) or [the Cumulus API](#build-dashboard-to-be-served-by-the-cumulus-api).


## Testing

### Unit Tests

```bash
  $ npm run test
```

### Integration & Validation Tests

For the integration tests to work, you have to first run the localstack application, launch the localAPI and serve the dashboard first. Run the following commands in separate terminal sessions:

Run background localstack application.
```bash
  $ npm run start-localstack
```

Serve the cumulus API (separate terminal)
```bash
  $ npm run serve-api
```

Serve the dashboard web application (another terminal)
```bash
  $ [HIDE_PDR=false ENABLE_RECOVERY=true APIROOT=http://localhost:5001] npm run serve
```

If you're just testing dashboard code, you can generally run all of the above commands as a single docker-compose stack.
```bash
  $ npm run start-dashboard
```
This brings up LocalStack, Elasticsearch, the Cumulus localAPI, and the dashboard.

Run the test suite (yet another terminal window)
```bash
  $ npm run cypress
```

When the cypress editor opens, click on `run all specs`.


### Local API server

For **development** and **testing** purposes only, you can run a Cumulus API locally. This requires `docker-compose` in order to stand up the Docker containers that serve Cumulus API.  There are a number of commands that will stand up different portions of the stack.  See the [Docker Service Diagram](#dockerdiagram) and examine the `docker-compose*.yml` file in the `/localAPI/` directory to see all of the possible combinations. Described below are each of the provided commands for running the dashboard and Cumulus API locally.

*Important Note: These `docker-compose` commands do not build distributable containers, but are a provided as testing conveniences.  The docker-compose[-\*].yml files show that they work by linking your local directories into the container.*

In order to run the Cumulus API locally you must first [build the dashboard](#buildlocally) and then run the containers that provide LocalStack and Elasticsearch services.

These are started and stopped with the commands:
```bash
  $ npm run start-localstack
  $ npm run stop-localstack
```

After these containers are running, you can start a cumulus API locally in a terminal window `npm run serve-api`, the dashboard in another window. `[HIDE_PDR=false ENABLE_RECOVERY=true APIROOT=http://localhost:5001] npm run serve` and finally cypress in a third window. `npm run cypress`.

Once the Docker app is running, If you would like to see sample data you can seed the database. This will load the same sample data into the application that is used during cypress testing.
```bash
  $ npm run seed-database
```

If you prefer to stand up more of the stack in Docker containers, you can include the cumulus api in the docker-compose stack. To run the Cumulus API in a Docker container, (which still leaves running the dashboard and cypress up to you), just run the `cumulusapi` service.

The cumulusapi Docker service is started and stopped:
```bash
  $ npm run start-cumulusapi
  $ npm run stop-cumulusapi
```

the start command, will exit successfully long before the stack is actually ready to run.
The output looks like this:
```bash
> cumulus-dashboard@2.0.0 start-cumulusapi /Users/savoie/projects/cumulus/cumulus-dashboard
> docker-compose -f ./localAPI/docker-compose.yml -f ./localAPI/docker-compose-serve-api.yml up -d

Creating localapi_shim_1 ... done
Creating localapi_elasticsearch_1 ... done
Creating localapi_localstack_1    ... done
Creating localapi_serve_api_1     ... done
```
In order to find out that the stack is fully up and ready to receive requests, you can run the command `npm run view-docker-logs` to follow the progress of the stack.  When the Docker logs have shown the following:
```bash
serve_api_1      | Starting server on port 5001
```
and
```bash
localstack_1     | Ready.
```
you should be able to verify access to the local Cumulus API at http://localhost:5001/token


Then you can run the dashboard locally (without Docker) `[HIDE_PDR=false APIROOT=http://localhost:5001] npm run serve` and open cypress tests `npm run cypress`.

The Docker compose stack also includes a command to let a developer start all development containers with a single command.

Bring up and down the entire stack (the localAPI and the dashboard) with:
```bash
  $ npm run start-dashboard
  $ npm run stop-dashboard
```
This runs everything, the backing Localstack and Elasticsearch containers, the local Cumulus API and dashboard.  Edits to your code will be reflected in the running dashboard.  You can run cypress tests still with `npm run cypress`.  As a warning, this command takes a very long time to start up because the containers come up in a specific order and generally this should be reserved for use by Earthdata Bamboo or some other continuous integration service.  But, if you are using it locally, **be sure to wait until all containers are fully up** before trying to visit the dashboard which is exposed at http://localhost:3000
The stack is ready when the `view-docker-logs` task shows:
```bash
dashboard_1      | > NODE_ENV=production http-server dist -p 3000 --proxy http://localhost:3000?
dashboard_1      |
dashboard_1      | Starting up http-server, serving dist
dashboard_1      | Available on:
dashboard_1      |   http://127.0.0.1:3000
dashboard_1      |   http://172.18.0.2:3000
dashboard_1      | Unhandled requests will be served from: http://localhost:3000?
dashboard_1      | Hit CTRL-C to stop the server
```


##### Troubleshooting Docker containers.

If something is not running correctly, or you're just interested, you can view the logs with a helper script, this will print out logs from each of the running docker containers.
```bash
  $ npm run view-docker-logs
```
This can be helpful in debugging problems with the docker application.

A common error is running the dashboard containers when the cumulus core unit-test-stack is running on your machine.  Just stop that stack and restart the dashboard stack to resolve.
```sh
ERROR: for localapi_shim_1  Cannot start service shim: driver failed programming external connectivity on endpoint localapi_shim_1 (7105603a4ff7fbb6f92211086f617bfab45d78cff47232793d152a244eb16feb): Bind for 0.0.0.0:9200 failed: port is already allocated

ERROR: for shim  Cannot start service shim: driver failed programming external connectivity on endpoint localapi_shim_1 (7105603a4ff7fbb6f92211086f617bfab45d78cff47232793d152a244eb16feb): Bind for 0.0.0.0:9200 failed: port is already allocated
```

#### Fully contained cypress testing.

You can run all of the cypress tests locally that Earthdata Bamboo runs with a single command:
```bash
  $ npm run e2e-tests
```
This stands up the entire stack as well as begins the e2e service that will run all cypress commands and report an exit code for their success or failure.  This is primarily used for CI, but can be useful to developers.


#### <a name=dockerdiagram></a> Docker Container Service Diagram.
![Docker Service Diagram](./ancillary/DashboardDockerServices.png)


## develop vs. master branches

The `master` branch is the branch where the source code of HEAD always reflects the latest product release. The `develop` branch is the branch where the source code of HEAD always reflects the latest merged development changes for the next release.  The `develop` branch is the branch where we should branch off.

When the source code in the develop branch reaches a stable point and is ready to be released, all of the changes should be merged back into master and then tagged with a release number.

## Create a Dashboard Release

### 1. Checkout `develop` branch

We will make changes in the `develop` branch.

### 2. Create a new branch for the release

Create a new branch off of the `develop` branch for the release named `release-vX.X.X` (e.g. `release-v1.3.0`).

### 3. Update the version number

When changes are ready to be released, the version number must be updated in `package.json`.

### 4. Update the minimum version of Cumulus API if necessary

See the `minCompatibleApiVersion` value in `app/src/js/config/index.js`.

### 5. Update CHANGELOG.md

Update the CHANGELOG.md. Put a header under the 'Unreleased' section with the new version number and the date.

Add a link reference for the GitHub "compare" view at the bottom of the CHANGELOG.md, following the existing pattern. This link reference should create a link in the CHANGELOG's release header to changes in the corresponding release.

Check to make sure there are `Breaking Changes` and `All Changes` section for the release if there are breaking changes. e.g. a new version of Cumulus API is required.

### 6. Update the version of the Cumulus API

If this release corresponds to a Cumulus Core package release, update the version of `@cumulus/api` to the latest package version so that the integration tests will run against that version.

### 7. Manual testing

Test the dashboard against a live API deployed with the latest Cumulus packages. The dashboard should be served from an S3 bucket through the [`/dashboard` API endpoint](https://nasa.github.io/cumulus-api/#serve-the-dashboard-from-a-bucket).

### 8. Create a pull request against the develop branch

Create a PR for the `release-vX.X.X` branch against the `develop` branch. Verify that the Earthdata Bamboo CI build for the PR succeeds and then merge to `develop`.

### 9. Create a pull request against the master branch

Create a PR for the `develop` branch against the `master` branch. Verify that the Earthdata Bamboo CI build for the PR succeeds and then merge to `master`.  Do not create a squash merge, but use a merge commit.

### 10. Create a git tag for the release

Push a new release tag to Github. The tag should be in the format `v1.2.3`, where `1.2.3` is the new version.

Create and push a new git tag:

```bash
  $ git checkout master
  $ git pull origin master
  $ git tag -a v1.x.x -m "Release 1.x.x"
  $ git push origin v1.x.x
```

### 11. Add the release to GitHub

Follow the [Github documentation to create a new release](https://help.github.com/articles/creating-releases/) for the dashboard using the tag that you just pushed. Make sure to use the content from the CHANGELOG for this release as the description of the release on GitHub.

### 12. Create PR of master back into develop

Create a PR for the `master` branch back into `develop` to bring the merge commit back into develop.

It is likely that no branch plan will exist for the `master` branch.
#### Create a bamboo branch plan for the release
 - In the Cumulus Dashboard in Bamboo (<https://ci.earthdata.nasa.gov/browse/CUM-CDG>), click `Actions -> Configure Plan` in the top right.
 - Next to `Plan branch` click the rightmost button that displays `Create Plan Branch` upon hover.
 - Click `Create plan branch manually`.
 - Choose Branch Name `master` and then click `create`.
 - Verify that the build has started for this plan.





<a name="bundlefootnote">1</a>: A dashboard bundle is just a ready-to-deploy compiled version of the dashboard and environment.
