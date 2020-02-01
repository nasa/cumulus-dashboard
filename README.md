# Cumulus Dashboard

[![CircleCI](https://circleci.com/gh/nasa/cumulus-dashboard.svg?style=svg)](https://circleci.com/gh/nasa/cumulus-dashboard)

Code to generate and deploy the dashboard for the Cumulus API.

## Documentation

- [Usage](https://github.com/nasa/cumulus-dashboard/blob/master/USAGE.md)
- [Development Guide](https://github.com/nasa/cumulus-dashboard/blob/master/DEVELOPMENT.md)
- [Technical documentation on tables](https://github.com/nasa/cumulus-dashboard/blob/master/TABLES.md)

## Wireframes and mocks

- [Designs](ancillary/dashboard-designs.pdf)
- [Wireframes](ancillary/dashboard-wireframes.pdf)

## Configuration

The dashboard is populated from the Cumulus API. The dashboard has to point to a working version of the Cumulus API before it is installed and built.

The information needed to configure the dashboard is stored at `app/src/js/config/config.js`.

The following environment variables override the default values in `config.js`:

| Env Name | Description |
| -------- | ----------- |
| HIDE_PDR | whether to hide the PDR menu, default to true |
| DAAC\_NAME    | e.g. LPDAAC, default to Local |
| STAGE | e.g. UAT, default to development |
| LABELS | gitc or daac localization (defaults to daac) |
| APIROOT | the API URL. This must be set by the user as it defaults to example.com |
| AUTH_METHOD | The type of authorization method protecting the Cumulus API.  [launchpad or earthdata] Default: earthdata  |
| ENABLE\_RECOVERY | If true, adds recovery options to the granule and collection pages. default: false |
| KIBANAROOT | \<optional\> Should point to a Kibana endpoint. Must be set to examine distribution metrics details. |
| SHOW\_TEA\_METRICS | \<optional\> display metrics from Thin Egress Application (TEA). default: true |
| SHOW\_DISTRIBUTION\_API\_METRICS | \<optional\> Display metrics from Cumulus Distribution API. default: false |
| ESROOT | \<optional\> Should point to an Elasticsearch endpoint. Must be set for distribution metrics to be displayed. |
| ES\_USER | \<optional\> Elasticsearch username, needed when protected by basic authorization |
| ES\_PASSWORD | \<optional\> Elasticsearch password,needed when protected by basic authorization |


## Building or running locally

The dashboard uses node v8.11. To build/run the dashboard on your local machine using node v8.11, install [nvm](https://github.com/creationix/nvm) and run `nvm use`.

We use npm for local package management.

```bash
  $ nvm use
  $ npm install
```

## Building the dashboard

### Building in Docker

The Cumulus Dashboard can be built inside of a Docker container, without needing to install any local dependencies.

```bash
  $ DAAC_NAME=LPDAAC STAGE=production HIDE_PDR=false LABELS=daac APIROOT=https://myapi.com ./bin/build_in_docker.sh
```

**NOTE**: Only the `APIROOT` environment variable is required.

The compiled files will be placed in the `dist` directory.

### Building locally

To build the dashboard:

```bash
  $ nvm use
  $ DAAC_NAME=LPDAAC STAGE=production HIDE_PDR=false LABELS=daac APIROOT=https://myapi.com npm run build
```

**NOTE**: Only the `APIROOT` environment variable is required.

The compiled files will be placed in the `dist` directory.

### Building a specific dashboard version

`cumulus-dashboard` versions are distributed using tags in GitHub. You can pull a specific version in the following manner:

```bash
  $ git clone https://github.com/nasa/cumulus-dashboard
  $ cd cumulus-dashboard
  $ git fetch origin ${tagNumber}:refs/tags/${tagNumber}
  $ git checkout ${tagNumber}
```

Then follow the steps noted above to build the dashboard locally or using Docker.

## Running the dashboard

### Running locally

To run the dashboard locally against a running Cumulus instance:

```bash
  $ git clone https://github.com/nasa/cumulus-dashboard
  $ cd cumulus-dashboard
  $ nvm use
  $ npm install
  $ APIROOT=https://myapi.com npm run serve
```

#### local API server

For **development** and **testing** purposes, you can run the Cumulus API locally. This requires `docker-compose` in order to stand up a docker app that serves the Cumulus API locally.  Note that there are a number of commands that will stand up different portions of the stack.  Look in the `/localAPI/` directory for `docker-compose` files to see all of the available options. Below are described each of the provided commands for running the dashboard and Cumulus API locally.  *Note: These `docker-compose` commands do not build distributable containers, but are a provided as testing conveniences.  The docker-compose[-\*].yml files show that they work by linking your local directories into the container.*

In order to run the Cumulus API locally you must run at least the containers that provide LocalStack and Elasticsearch.
These are started and stopped with the commands:
```bash
  $ npm run start-localstack
  $ npm run stop-localstack
```
After running this, you can run a cumulus API locally in a terminal window `npm run serve-api`


If you just want to run the Cumulus API, which leaves running the dashboard up to you, just run the `cumulusapi`

The cumulusapi docker app is started:
```bash
  $ npm run start-cumulusapi
```

Once the docker app is running, If you would like some sample data (the same data that is used during integration tests), you can seed the database. This will load sample data into the application.
```bash
  $ npm run seed-database
```

You can run the dashboard locally (without docker):
```bash
  $ npm run serve
```

After testing, you can stop the docker backend.
```bash
  $ npm run stop-cumulusapi
```

If something is not running correctly, or you're just interested, you can view the logs with a helper script, this will print out logs from each of the running docker containers.
```bash
  $ npm run view-docker-logs
```
This can be helpful in debugging problems with the docker application.


#### Alternative localAPI scripts.

Additional commands are provided that will run both the localAPI as well as your dashboard, allowing you to develop and run tests with a single command.

Bring up the entire stack (the localAPI and the dashboard) with:
```bash
  $ npm run start-dashboard
```
This runs everything including the local Cumulus API and dashboard.  Edits to your code will be reflected in the running dashboard.


when you're finished with development and testing, bring down the stack
```bash
  $ npm run stop-dashboard
```

#### Local end to end testing.

You can run all of the cypress tests locally that circleCI runs with a single command:
```bash
  $ npm run e2e
```

and the validation tests can be run
```bash
  $ npm run validation-tests
```


#### Docker Container Service Diagram.
![Docker Service Diagram](./ancillary/DashboardDockerServices.png)
#### NGAP Sandbox Metrics Development

##### Kibana and Elasticsearch access

In order to develop features that interact with Kibana or Elasticsearch in the NGAP sandbox, you need to set up tunnels through the metric's teams bastion-host.  First you must get access to the metric's host. This will require a [NASD ticket](https://bugs.earthdata.nasa.gov/servicedesk/customer/portal/7/create/79) and permission from the metrics team.  Once you have access to the metrics-bastion-host you can get the IP addresses for the Bastion, Kibana and Elasticsearch from the metrics team and configure your `.ssh/config` file to create you local tunnels.  This configuration will open traffic to the Kibana endpoint on localhost:5601 and Elasticsearch on localhost:9201 tunneling traffic through the Bastion and Kibana machines.

```
Host metrics-bastion-host
  Hostname "Bastion.Host.Ip.Address"
  User ec2-user
  IdentitiesOnly yes
  IdentityFile ~/.ssh/your_private_bastion_key
Host metrics-elk-tunnels
  Hostname "Kibana.Host.IP.Address"
  IdentitiesOnly yes
  ProxyCommand ssh metrics-bastion-host -W %h:%p
  User ec2-user
  IdentityFile ~/.ssh/your_private_bastion_key
  # kibana
  LocalForward 5601 "Kibana.Host.IP.Address":5601
  # elastic search
  LocalForward 9201 "Elasticsearch.Host.IP.Address":9201
```

Now you can configure you sandbox environment with these variables.

```sh
export ESROOT=http://localhost:9201
export KIBANAROOT=http://localhost:5601
```

If the Elasticsearch machine is protected by basic authorization, the following two variables should also be set.

```sh
export ES_USER=<username>
export ES_PASSWORD=<password>
```



### Running locally in Docker

There is a script called `bin/build_docker_image.sh` which will build a Docker image
that runs the Cumulus dashboard.  It expects that the dashboard has already been
built and can be found in the `dist` directory.

The script takes one optional parameter, the tag that you would like to apply to
the generated image.

Example of building and running the project in Docker:

```bash
  $ ./bin/build_docker_image.sh cumulus-dashboard:production-1
  ...
  $ docker run -e PORT=8181 -p 8181:8181 cumulus-dashboard:production-1
```

In this example, the dashboard would be available at http://localhost:8181/.

## Deployment Using S3

First build the site

```bash
  $ nvm use
  $ DAAC_NAME=LPDAAC STAGE=production HIDE_PDR=false LABELS=daac APIROOT=https://myapi.com npm run build
```

Then deploy the `dist` folder

```bash
  $ aws s3 sync dist s3://my-bucket-to-be-used --acl public-read
```

## Tests

### Unit Tests

```bash
  $ npm run test
```

## Integration & Validation Tests

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
  $ npm run serve
```

If you're just testing dashboard code, you can generally run all of the above commands as a single docker-compose stack.
```bash
  $ npm run start-dashboard
```
This brings up LocalStack, Elasticsearch, the Cumulus localAPI, and the dashboard.

Run the test suite (yet another terminal window)
```bash
  $ npm run validate
  $ npm run cypress
```

When the cypress editor opens, click on `run all specs`.


## develop vs. master branches

The `master` branch is the branch where the source code of HEAD always reflects the latest product release. The `develop` branch is the branch where the source code of HEAD always reflects the latest merged development changes for the next release.  The `develop` branch is the branch where we should branch off.

When the source code in the develop branch reaches a stable point and is ready to be released, all of the changes should be merged back into master and then tagged with a release number.

## How to release

### 1. Checkout `develop` branch

We will make changes in the `develop` branch.

### 2. Create a new branch for the release

Create a new branch off of the `develop` branch for the release named `release-vX.X.X` (e.g. `release-v1.3.0`).

### 3. Update the version number

When changes are ready to be released, the version number must be updated in `package.json`.

### 4. Update the minimum version of Cumulus API if necessary

See the `minCompatibleApiVersion` value in `app/scrips/config/index.js`.

### 5. Update CHANGELOG.md

Update the CHANGELOG.md. Put a header under the 'Unreleased' section with the new version number and the date.

Add a link reference for the GitHub "compare" view at the bottom of the CHANGELOG.md, following the existing pattern. This link reference should create a link in the CHANGELOG's release header to changes in the corresponding release.

### 6. Create a pull request against the develop branch

Create a PR for the `release-vX.X.X` branch against the `develop` branch. Verify that the Circle CI build for the PR succeeds and then merge to `develop`.

### 7. Create a pull request against the master branch

Create a PR for the `develop` branch against the `master` branch. Verify that the Circle CI build for the PR succeeds and then merge to `master`.

### 8. Create a git tag for the release

Push a new release tag to Github. The tag should be in the format `v1.2.3`, where `1.2.3` is the new version.

Create and push a new git tag:

```bash
  $ git checkout master
  $ git tag -a v1.x.x -m "Release 1.x.x"
  $ git push origin v1.x.x
```

### 9. Add the release to GitHub

Follow the [Github documentation to create a new release](https://help.github.com/articles/creating-releases/) for the dashboard using the tag that you just pushed. Make sure to use the content from the CHANGELOG for this release as the description of the release on GitHub.
