# Contributing

Thanks for considering contributing and making our planet easier to explore!

We're excited you would like to contribute to Cumulus! Whether you're finding bugs, adding new features, fixing anything broken, or improving documentation, get started by submitting an issue or pull request!

## Submitting an Issue

If you have any questions or ideas, or notice any problems or bugs, first [search open issues](https://github.com/nasa/cumulus-dashboard/issues) to see if the issue has already been submitted. We may already be working on the issue. If you think your issue is new, you're welcome to [create a new issue](https://github.com/nasa/cumulus-dashboard/issues/new).

## Pull Requests

If you want to submit your own contributions, follow these steps:

* Fork the Cumulus Dashboard repo
* Create a new branch from the branch you'd like to contribute to
* Establish that everything is working before you write code. See ['Getting Started for beginners'](#getting-started-for-beginners) below.
* If an issue doesn't already exist, submit one (see above)
* [Create a pull request](https://help.github.com/articles/creating-a-pull-request/) from your fork into the target branch of the nasa/cumulus-dashboard repo
* Be sure to [mention the corresponding issue number](https://help.github.com/articles/closing-issues-using-keywords/) in the PR description, i.e. "Fixes Issue #10"
* If your contribution requires a specific version of the Cumulus API, bump (or add) the version in `app/src/js/config/index.js`.
  * If you don't know the Cumulus API version (because it hasn't been released), create a one-line PR with the following attributes:
    * Title: Version bump for next Cumulus API release
    * In the body, write a quick explanation and link to the unreleased Cumulus Core PR
    * Set `'change-me-next-api-release'` as the value for the `minCompatibleApiVersion` config value.
* Upon submission of a pull request, the Cumulus development team will review the code
* The request will then either be merged, declined, or an adjustment to the code will be requested

## Guidelines

We ask that you follow these guidelines with your contributions:

### Tests

All of the automated tests for this project need to pass before your submission will be accepted. See the README for instructions on how to run tests and verify that the tests pass. If you add new functionality, please consider adding tests for that functionality as well.

### Commits

* Make small commits that show the individual changes you are making
* Write descriptive commit messages that explain your changes

Example of a good commit message:

```
Improve contributing guidelines. Fixes #10

Improve contributing docs and consolidate them in the standard location https://help.github.com/articles/setting-guidelines-for-repository-contributors/
```

### For more information on Cumulus governance, see the [Cumulus Code Contribution Guidelines](https://docs.google.com/document/d/14J_DS6nyQ32BpeVjdR-YKfzHAzFB299tKghPGshXUTU/edit) and [the Cumulus Wiki](https://wiki.earthdata.nasa.gov/display/CUMULUS/Cumulus).

## Getting started for beginners 

### Pre-requisites
- [Docker](https://www.docker.com/) a Docker daemon must be running on your local machine. Running Docker Desktop is a simple way to achieve this
- Node Version Manager ([NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating))
- Node Package Manager ([NPM](https://github.com/npm/cli))

### Instructions
1. If you have not done so already, [fork this repo](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo). 
2. [Clone your forked repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) to your local environment.
```bash
git clone https://github.com/<your github account name>/cumulus-dashboard.git
cd cumulus-dashboard
```
3. [Create a branch](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging) to develop your code in
4. Install the correct version fo Node.js for the Cumulus Dashboard and set the version for this project
```bash
nvm install v20.12.2
nvm use
```
5. Install the cumulus dashboard
```bash
npm install
```
6. Run the unit tests for cumulus dashboard. Do not proceed to the subsequent steps until all these tests have passed.
```bash
npm test
```
7. Start up the mock services Cumulus Dashboard needs to communicate with. Cumulus API, EDL/Launchpad. These services will be accessible from `localhost:5001`.
```bash
npm run start-localstack
```
```bash
npm run serve-api
```
8. In a seperate terminal, build and run the cumulus dashboard. This will start up a browser instance and load the application from localhost:3000. This can take a while.
```bash
APIROOT=http://localhost:5001 npm run build
APIROOT=http://localhost:5001 npm run serve
```
9. Run the integration tests. This will start up a cypress instance. Click on `run all specs`. Do not proceed to the subsequent steps until all these tests have passed.
```bash
npm run cypress
```
You are now ready to start developing!