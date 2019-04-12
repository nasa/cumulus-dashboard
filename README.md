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

The information needed to configure the dashboard is stored at `app/scripts/config/config.js`.

The following environment variables override the default values in `config.js`:

| Env Name | Description
| -------- | -----------
| HIDE_PDR | whether to hide the PDR menu, default to true
| DAAC\_NAME | e.g. LPDAAC, default to Local
| STAGE | e.g. UAT, default to development
| LABELS | gitc or daac localization (defaults to daac)
| APIROOT | the API URL. This must be set as it defaults to example.com

## Building or running locally

The dashboard uses node v8.11. To build/run the dashboard on your local machine using node v8.11, install [nvm](https://github.com/creationix/nvm) and run `nvm use`.

`yarn` is required to install the correct dependencies for the dashboard. To install `yarn`:

```bash
  $ nvm use
  $ npm install -g yarn
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
  $ DAAC_NAME=LPDAAC STAGE=production HIDE_PDR=false LABELS=daac APIROOT=https://myapi.com yarn run build
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

To run the dashboard locally:

```bash
  $ git clone https://github.com/nasa/cumulus-dashboard
  $ cd cumulus-dashboard
  $ nvm use
  $ yarn install
  $ APIROOT=https://myapi.com yarn run serve
```

#### Fake API server

For development and testing purposes, you can use a fake API server provided with the dashboard. To use the fake API server, run `node fake-api.js` in a separate terminal session, then launch the dashboard with:

```bash
  $ nvm use
  $ APIROOT=http://localhost:5001 yarn run serve
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
  $ DAAC_NAME=LPDAAC STAGE=production HIDE_PDR=false LABELS=daac APIROOT=https://myapi.com yarn run build
```

Then deploy the `dist` folder

```bash
  $ aws s3 sync dist s3://my-bucket-to-be-used --acl public-read
```

## Tests

### Unit Tests

```bash
  $ yarn run test
```

## Integration & Validation Tests

For the integration tests to work, you have to launch the fake API and the dashboard first. Run the following commands in separate terminal sessions:

```bash
  $ node fake-api.js
  $ APIROOT=http://localhost:5001 yarn run serve
```

Run the test suite in another terminal:

```bash
  $ yarn run validation
  $ yarn run cypress
```

When the cypress editor opens, click on `run all specs`.

## develop vs. master branches

The `master` branch is the branch where the source code of HEAD always reflects the latest product release. The `develop` branch is the branch where the source code of HEAD always reflects the latest merged development changes for the next release.  The `develop` branch is the branch where we should branch off.

When the source code in the develop branch reaches a stable point and is ready to be released, all of the changes should be merged back into master and then tagged with a release number.

## How to release

### 1. Checkout `develop` branch

We will make changes in the `develop` branch.

### 2. Update the version number

When changes are ready to be released, the version number must be updated in `package.json`.

### 3. Update the minimum version of Cumulus API if necessary

### 4. Update CHANGELOG.md

Update the CHANGELOG.md. Put a header under the 'Unreleased' section with the new version number and the date.

Add a link reference for the GitHub "compare" view at the bottom of the CHANGELOG.md, following the existing pattern. This link reference should create a link in the CHANGELOG's release header to changes in the corresponding release.

### 5. Create a pull request against the master branch

Create a PR against the `master` branch. Verify that the Circle CI build for the PR succeeds and then merge to master.

### 6. Create a git tag for the release

Push a new release tag to Github. The tag should be in the format `v1.2.3`, where `1.2.3` is the new version.

Create and push a new git tag:

```bash
  $ git checkout master
  $ git tag -a v1.x.x -m "Release 1.x.x"
  $ git push origin v1.x.x
```

### 7. Add the release to GitHub

Follow the [Github documentation to create a new release](https://help.github.com/articles/creating-releases/) for the dashboard using the tag that you just pushed. Make sure to use the content from the CHANGELOG for this release as the description of the release on GitHub.
