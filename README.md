# Weaviate Playground

Weaviate Playground is a Javascript web app that allows users to explore [Weaviate instances](https://github.com/creativesoftwarefdn/weaviate).

- **Dynamic:** any Weaviate instance can be easily plugged via route params. Playground will sync it's UI with the instance's [ontologies](https://github.com/creativesoftwarefdn/weaviate#ontology) through introspection.
- **Client-side only:** Playground runs client-side only. This makes the app very portable and easily distributable. It can be easily run from a static file server or locally from a device with a desktop browser.

## Usage

## Roadmap

- [ ] **Initial project setup**
  - [ ] Determine browser support
  - [ ] Typescript setup
  - [ ] Code styling rules (i.e. prettier)
  - [ ] Babel build process
  - [ ] Gitflow
  - [ ] Precommit and prepush hooks
  - [ ] Pipelines
  - [ ] Semver
  - [ ] Deployment
- [ ] **Initial app setup**
  - [ ] Create React app
  - [ ] Add routing
  - [ ] Add GraphQL client
  - [ ] Add Styled Components
  - [ ] Create Layout container
  - [ ] Add introspection logic (query could change over time)
- [ ] **Component library (more details will follow)**
- [ ] **Library section**
  - [ ] Create library container
  - [ ] Implement class text search
  - [ ] Implement local/network toggle filter
  - [ ] Implement all/things/actions selection filter
  - [ ] Create selection container
  - [ ] Create class checkbox button
  - [ ] Populate container checkbox buttons
- [ ] **Filter section**
  - [ ] Create filter container
  - [ ] Create checkbox filter
  - [ ] Create slider filter
  - [ ] Create other filters?
  - [ ] Implement class text search
  - [ ] Populate container with filters
- [ ] **Graph section**
  - [ ] Create graph container
  - [ ] Create class with pie menu and badge
  - [ ] Create edge
  - [ ] Populate container with classes and edges
  - [ ] Implement zoom functionality
  - [ ] Implement 'Relate' interaction
  - [ ] Implement 'Expand' interaction
  - [ ] Implement 'Hide' interaction
  - [ ] Implement 'Pin' interaction
- [ ] **Results section**
  - [ ] Create results container
  - [ ] Create sankey diagram with filters
  - [ ] Create JSON output view
  - [ ] Add outputs to container and populate with data
- [ ] **Support bar**
  - [ ] Create support bar container
  - [ ] Implement logic
- [ ] **Unit tests**
- [ ] **E2E tests**
- [ ] **Performance tests (in combination with Weaviate)**
- [ ] **Security tests (in combination with Weaviate)**
- [ ] **Icing / extra**
  - [ ] Animations
  - [ ] Multi-language?
  - [ ] Authentication?
