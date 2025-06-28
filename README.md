
# Hybrid BI: Metabase + Superset

Welcome to **Hybrid BI: Metabase + Superset**! This project combines the power of [Metabase](https://www.metabase.com/) and [Apache Superset](https://superset.apache.org/) into a single, hybrid business intelligence platform.

> **Note:** This repository is a work in progress.


---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Usage](#usage)
5. [Testing](#running-tests-conceptual)
6. [Extending the Application](#extending-the-application)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

---

## Overview

Hybrid BI leverages the strengths of both Metabase and Superset:

- **Metabase:** Known for its ease of use and intuitive interface, allowing anyone to ask questions and learn from data without knowing SQL.
- **Superset:** A modern, enterprise-ready BI web application with a wide array of visualizations and a powerful SQL editor.

By combining these two tools, we aim to create a platform that is both user-friendly and powerful, suitable for a wide range of data exploration and visualization needs.

## Project Structure

```
sup-met-BI-hybrid/
├── superset-backend/    # Superset backend (Python/Flask)
├── metabase-ui/         # Metabase frontend (React/ClojureScript)
├── packages/metabase-question-builder/ # Standalone Metabase question builder React components
├── ui/                  # Main React app integrating both modes
├── hybrid-bi-nodejs-server/ # Node.js server for integration (WIP)
├── src/                 # Angular app (if used)
├── packages/            # Shared packages/modules
└── ...                  # Other supporting files and configs
```


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/) or npm
- [Python](https://www.python.org/downloads/) (3.8+)
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose (recommended for Superset)
- [Clojure](https://clojure.org/guides/getting_started) and Leiningen (if working with `metabase-ui`)


### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sup-met-BI-hybrid
   ```

2. **Set up Superset Backend (`superset-backend`):**
   It's recommended to run Superset using Docker for ease of setup.
   ```bash
   cd superset-backend
   docker compose -f docker-compose-non-dev.yml up -d
   ```
   - Wait for Superset to start. Default credentials are often `admin`/`admin`.
   - Access Superset at [http://localhost:8088](http://localhost:8088).
   - **Important:** Ensure Superset is configured for CORS to allow requests from the UI application's origin (default `http://localhost:3000`).

3. **Set up Metabase Question Builder Package (`packages/metabase-question-builder`):**
   ```bash
   cd packages/metabase-question-builder
   yarn install # or npm install
   cd ../..
   ```

4. **Set up the Main UI (`ui`):**
   ```bash
   cd ui
   yarn install # or npm install
   cd ..
   ```


## Usage

Once both the Superset backend and the UI are set up, you can run them concurrently in separate terminals.

### Start the Superset Backend
```bash
cd superset-backend
docker compose -f docker-compose-non-dev.yml up
```

### Start the UI application
```bash
cd ui
yarn start # or npm start
```

You can then access:

- Superset UI: [http://localhost:8088](http://localhost:8088)
- Hybrid BI UI: [http://localhost:3000](http://localhost:3000)


---

## Development Workflow Notes

- **`supersetApi.js`:** The file `ui/src/utils/supersetApi.js` contains the logic for communicating with the Superset backend. API endpoints and data transformations are defined here.
- **`metabase-question-builder/src/api.js`:** This file adapts the calls from Metabase components to use `supersetApi.js`. The crucial part is the translation of Metabase's query language (MBQL) to a format Superset can understand (e.g., Superset's `formData` for the `/api/v1/chart/data` endpoint). This translation is currently a placeholder and needs significant work.


## Running Tests (Conceptual)

Automated tests are defined conceptually and would need to be run with appropriate test runners.

1. **Superset API Utility Tests (`ui/src/utils/supersetApi.js`):**
   ```bash
   cd ui
   yarn test src/utils/supersetApi.test.js # Assuming test files are named accordingly
   ```
2. **Metabase Question Builder API Integration Tests (`packages/metabase-question-builder/src/api.js`):**
   ```bash
   cd packages/metabase-question-builder
   yarn test src/api.test.js
   ```
3. **UI Component Tests (`ui/src`):**
   ```bash
   cd ui
   yarn test
   ```
4. **E2E Tests:**
   - Require running instances of both the Superset backend and the UI application.
   - Would use tools like Cypress or Playwright. (Setup not included).


## Extending the Application

- **New Visualizations (Advanced Mode):**
  - If using Superset's Embedded SDK, you can embed additional Superset charts or dashboards.
  - If rendering manually, you would need to understand the `formData` for the desired Superset chart type and implement rendering logic in the `ui` application.
- **New UI Components (Simple Mode):**
  - If extracting more components from Metabase, they would be refactored and added to the `packages/metabase-question-builder` or a similar new package.
- **Backend Functionality:**
  - New API endpoints can be added to Superset by developing custom Flask Blueprints or modifying existing ones (refer to Superset's developer documentation).


## Current Status & Known Limitations

- **Query Execution:** The translation from Metabase's query representation (MBQL) to a format Superset can execute (e.g., `formData` for `/api/v1/chart/data`) in `packages/metabase-question-builder/src/api.js` is a **major placeholder**. This is the most critical piece for the "Simple Mode" to be fully functional.
- **Authentication:** User authentication and session management are conceptually defined (JWT via Superset) but not fully implemented in the frontend API client.
- **Advanced Mode:** The "Advanced Mode" is a placeholder UI. Integration with Superset Embedded SDK or manual chart rendering is not yet implemented.
- **Error Handling:** Basic error handling is in place, but comprehensive error reporting and user feedback need improvement.
- **Dashboard Storage:** Saving and loading dashboards created in "Simple Mode" is not implemented.

---

## Troubleshooting

- If you encounter issues with dependencies, ensure your Node.js, Python, and Yarn versions match the prerequisites.
- For port conflicts, make sure nothing else is running on ports 3000 or 8088.
- For more help, check the [Metabase docs](https://www.metabase.com/docs/latest/) and [Superset docs](https://superset.apache.org/docs/intro).

---

## Contributing

We welcome contributions to this project! If you'd like to contribute, please follow the guidelines in the original Metabase and Superset repositories:

- [Metabase Contributing Guide](https://github.com/metabase/metabase/blob/master/docs/developers-guide/start.md)
- [Superset Contributing Guide](https://github.com/apache/superset/blob/master/CONTRIBUTING.md)

---

## License

This project is a combination of two open-source projects, each with its own license:

- **Metabase:** Released under the AGPL. See the [Metabase license](https://github.com/metabase/metabase/blob/master/LICENSE.txt) for details.
- **Superset:** Released under the Apache License 2.0. See the [Superset license](https://github.com/apache/superset/blob/master/LICENSE.txt) for details.

Any new code created specifically for this hybrid project will be released under the MIT license.

---

## Contact

For questions or support, please open an issue in this repository.
```

This repository is a work in progress.