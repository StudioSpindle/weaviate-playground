
<h1 align="center">
    <img alt='Weaviate logo' src='https://raw.githubusercontent.com/semi-technologies/weaviate/19de0956c69b66c5552447e84d016f4fe29d12c9/docs/assets/weaviate-logo.png' width='180' align='right' /><br>
    Weaviate Playground (🚧 BETA)<br>
</h1>

<p align="center">Weaviate Playground is a Javascript web app that allows users to explore [Weaviate instances](https://github.com/creativesoftwarefdn/weaviate). It is a graphical user interface (GUI) which can help to visualise your Weaviate instance.</p>

---

## Weaviate Playground

The Weaviate Playground is:
- **Dynamic:** any Weaviate instance can be easily plugged via route params. Playground will sync it's UI with the instance's [ontologies](https://github.com/creativesoftwarefdn/weaviate#ontology) through introspection.
- **Client-side only:** Playground runs client-side only. This makes the app very portable and easily distributable. It can be easily run from a static file server or locally from a device with a desktop browser.

## Usage

The Weaviate Playground works in combination with a Weaviate. Meaning that you will have to run a Weaviate in order for the playground to visualise your data.

Documentation on setting up and running a Weaviate for the Weaviate Playground can be found [on the Weaviate Git repository](https://github.com/semi-technologies/weaviate/blob/master/docs/en/use/weaviate-playground.md) as part of the Weaviate repo.

To view the Weaviate Playground make sure you have a Weaviate instance running and then follow the next few steps.  

### Dependencies
- [Docker](https://docs.docker.com/v17.12/docker-for-mac/install/)

### Running Weaviate Playground in Docker

In your terminal run the following command: 

`$ docker run -d -p 80:80 semitechnologies/weaviate-playground:latest`

Running this command will fetch your local instance of Weaviate.

> Note: If you prefer you can also [run the whole stack](https://github.com/semi-technologies/weaviate/blob/master/docs/en/use/running-weaviate.md#running-the-latest-version).

Once that's running you can open your browser and ...[to be defined]
 

## Contribute

This app is based on [Create React App](https://facebook.github.io/create-react-app/). You can utilize their commands to start, build and eject the app.

### Dependencies
- [NodeJS](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/)

#### Installation

```bash
yarn
```

#### Starting

```bash
yarn start
```

This will automatically open your browser window and navigate to the right url. Make sure to add a weaviateUri param pointing to a Weaviate GraphQL instance to load data. For example, your complete url could look like this: `http://localhost:3000?weaviateUri=http://localhost:8081/graphql`

#### Testing

```bash
yarn test
```

This will run all tests. You can also run tests separate from eachother by adding `:lint`, `:types` or `:unit` to the test command.

#### Formatting

```bash
yarn prettier:fix
```

This will format Typescript, HTML and GraphQL files by using [Prettier](https://prettier.io/). Replace `:fix` with `:check` if you don't want to fix code.

#### Analyzing

```bash
yarn analyze
```

This will run a source map explorer to inspect the composition of the app by file size. Inspection could come in handy when optimizing code for faster downloads.

#### Releasing

```bash
yarn release
```

This will create a release by bumping the semver version number and optimizing code for production. You can also create a build without bumping the version number by running `yarn build`.

#### Code quality

We try to maintain code quality with testing and formatting. A precommit and prepush hook will run all tests. The hooks don't format code because this will interfere with commits that have change selections. It is the responsibility of the developer to run Prettier. Many code editors can run Prettier automatically when saving code.

## Docker

The Weaviate playground is available as Docker container here: https://hub.docker.com/r/creativesoftwarefdn/weaviate-playground

You can run the stable (master branch) and unstable (develop branch) as follows:
- STABLE: `docker run -d -p 8080:80 creativesoftwarefdn/weaviate-playground:stable`
- UNSTABLE: `docker run -d -p 8080:80 creativesoftwarefdn/weaviate-playground:unstable`

## Build Status

| Branch   | Status        |
| -------- |:-------------:|
| Master   | [![Build Status](https://api.travis-ci.com/SeMI-network/playground.svg?branch=master)](https://travis-ci.com/SeMI-network/playground/branches)
| Develop  | [![Build Status](https://api.travis-ci.com/SeMI-network/playground.svg?branch=develop)](https://travis-ci.com/SeMI-network/playground/branches)