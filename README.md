# Hybrid BI: Metabase Question Builder with Superset Backend

This project integrates Metabase's intuitive no-code question builder experience with Apache Superset's powerful backend, visualization capabilities, and data governance features. The goal is to provide a single web application that offers both a "Simple Mode" (Metabase-like query building) and an "Advanced Mode" (leveraging Superset's rich charting and dashboarding).

## Project Structure

*   `/superset-backend`: A clone of Apache Superset, used as the backend for data connections, query execution, and advanced visualizations.
*   `/metabase-ui`: A clone of Metabase, from which the question builder UI components are extracted. (Primarily for reference and potential future component extraction).
*   `/packages/metabase-question-builder`: Standalone React components refactored from the Metabase frontend, providing the "Simple Mode" data exploration interface.
*   `/ui`: The main React application that orchestrates the user interface, integrating the `metabase-question-builder` for Simple Mode and providing a (planned) interface for Superset's Advanced Mode.

## Getting Started

### Prerequisites

*   Node.js and Yarn (or npm) for the frontend components.
*   Python (3.8+) and pip for Superset.
*   Docker and Docker Compose (recommended for running Superset).
*   Clojure and Leiningen (if you need to work with the original Metabase frontend in `metabase-ui`).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd hybrid-bi
    ```

2.  **Set up Superset Backend (`superset-backend`):**

    It's recommended to run Superset using Docker for ease of setup.
    ```bash
    cd superset-backend
    # Checkout a specific stable version if needed, e.g., git checkout 4.0.1
    # Copy custom config for CORS if needed (see Superset documentation)
    # Example: cp ../docker-configs/superset_config.py ./docker/pythonpath_dev/superset_config.py
    docker compose -f docker-compose-non-dev.yml up -d # For a non-development, more stable setup
    ```
    *   Wait for Superset to start. Default credentials are often `admin`/`admin`.
    *   Access Superset at `http://localhost:8088`.
    *   **Important:** Ensure Superset is configured for CORS to allow requests from the UI application's origin (default `http://localhost:3000`). This typically involves creating a `superset_config.py` in the `docker/pythonpath_dev/` directory (for Docker Compose) or as specified by Superset's documentation, with settings like:
        ```python
        ENABLE_CORS = True
        CORS_OPTIONS = {
            'supports_credentials': True,
            'allow_headers': ['*'], # Be more specific in production
            'resources': ['*'],
            'origins': ['http://localhost:3000'] # Adjust if your UI runs elsewhere
        }
        ```

3.  **Set up Metabase Question Builder Package (`packages/metabase-question-builder`):**

    This package is used by the main `ui` application. Its dependencies are usually managed via the `ui` app's `package.json` if using a monorepo setup (e.g., Yarn workspaces or Lerna). If it's treated as a separate local package:
    ```bash
    cd packages/metabase-question-builder
    yarn install # or npm install
    # yarn build # If it has its own build step, though often linked directly in dev
    cd ../..
    ```

4.  **Set up the Main UI (`ui`):**
    ```bash
    cd ui
    yarn install # or npm install
    cd ..
    ```

### Running in Development Mode

1.  **Ensure Superset is running** (see installation step above).
    *   Accessible at `http://localhost:8088`.

2.  **Start the UI application:**
    ```bash
    cd ui
    yarn start # or npm start
    ```
    *   This will typically open the Hybrid BI application in your browser at `http://localhost:3000`.

### Development Workflow Notes

*   **`supersetApi.js`:** The file `ui/src/utils/supersetApi.js` contains the logic for communicating with the Superset backend. API endpoints and data transformations are defined here.
*   **`metabase-question-builder/src/api.js`:** This file adapts the calls from Metabase components to use `supersetApi.js`. The crucial part is the translation of Metabase's query language (MBQL) to a format Superset can understand (e.g., Superset's `formData` for the `/api/v1/chart/data` endpoint). This translation is currently a placeholder and needs significant work.

## Running Tests (Conceptual)

Automated tests are defined conceptually and would need to be run with appropriate test runners.

1.  **Superset API Utility Tests (`ui/src/utils/supersetApi.js`):**
    ```bash
    cd ui
    yarn test src/utils/supersetApi.test.js # Assuming test files are named accordingly
    ```
2.  **Metabase Question Builder API Integration Tests (`packages/metabase-question-builder/src/api.js`):**
    ```bash
    cd packages/metabase-question-builder
    yarn test src/api.test.js
    ```
3.  **UI Component Tests (`ui/src`):**
    ```bash
    cd ui
    yarn test
    ```
4.  **E2E Tests:**
    *   Require running instances of both the Superset backend and the UI application.
    *   Would use tools like Cypress or Playwright. (Setup not included).

## Extending the Application

*   **New Visualizations (Advanced Mode):**
    *   If using Superset's Embedded SDK, you can embed additional Superset charts or dashboards.
    *   If rendering manually, you would need to understand the `formData` for the desired Superset chart type and implement rendering logic in the `ui` application.
*   **New UI Components (Simple Mode):**
    *   If extracting more components from Metabase, they would be refactored and added to the `packages/metabase-question-builder` or a similar new package.
*   **Backend Functionality:**
    *   New API endpoints can be added to Superset by developing custom Flask Blueprints or modifying existing ones (refer to Superset's developer documentation).

## Current Status & Known Limitations

*   **Query Execution:** The translation from Metabase's query representation (MBQL) to a format Superset can execute (e.g., `formData` for `/api/v1/chart/data`) in `packages/metabase-question-builder/src/api.js` is a **major placeholder**. This is the most critical piece for the "Simple Mode" to be fully functional.
*   **Authentication:** User authentication and session management are conceptually defined (JWT via Superset) but not fully implemented in the frontend API client.
*   **Advanced Mode:** The "Advanced Mode" is a placeholder UI. Integration with Superset Embedded SDK or manual chart rendering is not yet implemented.
*   **Error Handling:** Basic error handling is in place, but comprehensive error reporting and user feedback need improvement.
*   **Dashboard Storage:** Saving and loading dashboards created in "Simple Mode" is not implemented.
```

This repository is a work in progress.