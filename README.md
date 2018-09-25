# Cumulus Dashboard

[![CircleCI](https://circleci.com/gh/nasa/cumulus-dashboard.svg?style=svg)](https://circleci.com/gh/nasa/cumulus-dashboard)

Code to generate and deploy the dashboard for the Cumulus API.

## Documentation

- [Usage](https://github.com/cumulus-nasa/cumulus-dashboard/blob/master/USAGE.md)
- [Development Guide](https://github.com/cumulus-nasa/cumulus-dashboard/blob/master/DEVELOPMENT.md)
- [Technical documentation on tables](https://github.com/cumulus-nasa/cumulus-dashboard/blob/master/TABLES.md)

## Wireframes and mocks

- [Designs](ancillary/dashboard-designs.pdf)
- [Wireframes](ancillary/dashboard-wireframes.pdf)

## Configuration

The dashboard is populated from the Cumulus API. The dashboard has to point to a working version of the Cumulus API before it is installed and built.

The information needed to configure the dashboard are stored at `app/scripts/config/config.js`.

The following Environment Variables override the default values in `config.js`:

| Env Name | Description
| -------- | -----------
| HIDE_PDR | whether to hide the PDR menu, default to true
| DAAC\_NAME | e.g. LPDAAC, default to Local
| STAGE | e.g. UAT, default to development
| LABELS | gitc or daac localization (defaults to daac)
| APIROOT | the API URL. This must be set as it defaults to example.com 

     $ DAAC_NAME=LPDAAC STAGE=dev HIDE_PDR=false LABELS=daac APIROOT=https://myapi.com npm run serve

## Building in Docker

The Cumulus Dashboard can be built inside of a Docker container, without needing to install any local dependencies.

Example of building for the "production" environment:
```
$ ./bin/build_in_docker production
```

The compiled files will be placed in the `dist` directory.

## Building locally

This requires [nvm](https://github.com/creationix/nvm) and node v8.11. To set v8.11 as the default, use `nvm use`.

```(bash)
git clone https://github.com/cumulus-nasa/cumulus-dashboard
cd cumulus-dashboard
nvm use
npm install
npm run serve
```

## Tests

### Unit Tests

     $ npm run test
  
## Integration Tests

Run the Dashboard in a terminal:

     $ npm run serve

Run the test suite in another terminal:

     $ npm run cypress

When the cypress editor opens, click on `run all specs`.


## Deployment Using S3

First build the site

     $ DAAC_NAME=LPDAAC STAGE=production HIDE_PDR=false LABELS=daac APIROOT=https://myapi.com npm run build

Then deploy the `dist` folder

     $ aws s3 sync dist s3://my-bucket-to-be-used --acl public-read

## Running locally in docker

There is a script called `bin/build_docker_image.sh` which will build a Docker image
that runs the Cumulus Dashboard.  It expects that the dashboard has already been
built and can be found in the `dist` directory.

The script takes one optional parameter, the tag that you would like to apply to
the generated image.

Example of building and running the project in Docker
```
$ ./bin/build_docker_image.sh cumulus-dashboard:production-1
...
$ docker run -e PORT=8181 -p 8181:8181 cumulus-dashboard:production-1
```

In this example, the dashboard would be available at http://localhost:8181/