# PolyDessin

## About the App

PolyDessin is an online-based graphics editor. The app allows you to use classic `MS Paint` tools such as pen, brush, spray, stamp, selection and more to draw anything you'd like. You can also export your drawings as JPEG, PNG or SVG, or even send them by email. Other major features include saving your drawings to a public gallery, loading other users' public drawings and even continuing drawings you might have forgotten to save.

### Contributors
- Joe Abdo
- Abdelrahman Bassiouni
- Vlad Drelciuc
- William Décoste
- Songtao Zhang

### Screenshots

[![Capture.png](https://i.postimg.cc/Cx4fVTJp/Capture.png)](https://postimg.cc/BjXvxzdm)

## Configuration

- You will need to rename the file `/server/.env-template` to `/server/.env` and replace all the necessary fields
- All the following commands need to be executed under the `/client` and `/server` directories

### Prerequisite

- Install `npm` (bundled with [Node](https://nodejs.org/en/download/))

- To install all project dependencies, run `npm ci`

### Start the App

To start the app, run `npm start`

The client is accessible at `http://localhost:4200/` and will launch automatically

The server is accessible at `http://localhost:3000/`

### Unit Tests

- Run `npm run test` to launch unit tests

- Run `npm run coverage` to generate a test coverage report

### Lint

- Run `npm run lint` to execute TSLint

- Run `npm run lint --fix` to automatically fix certain lint errors
