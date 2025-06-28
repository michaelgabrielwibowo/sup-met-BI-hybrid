# Hybrid BI: Metabase + Superset

This repository is a work in progress to combine the power of Metabase and Superset into a single, hybrid business intelligence platform.

## Overview

This project aims to leverage the strengths of both Metabase and Superset:

*   **Metabase:** Known for its ease of use and intuitive interface, allowing anyone to ask questions and learn from data without knowing SQL.
*   **Superset:** A modern, enterprise-ready BI web application with a wide array of visualizations and a powerful SQL editor.

By combining these two tools, we hope to create a platform that is both user-friendly and powerful, suitable for a wide range of data exploration and visualization needs.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v22 or higher)
*   [Yarn](https://yarnpkg.com/)
*   [Clojure](https://clojure.org/guides/getting_started)
*   [Python](https://www.python.org/downloads/) (3.9 or higher)
*   [Docker](https://www.docker.com/products/docker-desktop/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/michaelgabrielwibowo/sup-met-BI-hybrid.git
    cd sup-met-BI-hybrid
    ```

2.  **Set up the Metabase UI:**

    ```bash
    cd metabase-ui
    yarn install
    yarn build
    ```

3.  **Set up the Superset backend:**

    ```bash
    cd ../superset-backend
    # It is recommended to create a virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements/development.txt
    pip install -e .
    superset db upgrade
    superset fab create-admin
    superset init
    ```

## Usage

Once both the Metabase UI and the Superset backend are set up, you can run them concurrently.

*   **To start the Metabase UI:**

    ```bash
    cd metabase-ui
    yarn build-hot
    ```

*   **To start the Superset backend:**

    ```bash
    cd superset-backend
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    superset run -p 8088 --with-threads --reload --debugger
    ```

You can then access the Metabase UI at `http://localhost:3000` and the Superset UI at `http://localhost:8088`.

## Contributing

We welcome contributions to this project! If you'd like to contribute, please follow the guidelines in the original Metabase and Superset repositories:

*   [Metabase Contributing Guide](https://github.com/metabase/metabase/blob/master/docs/developers-guide/start.md)
*   [Superset Contributing Guide](https://github.com/apache/superset/blob/master/CONTRIBUTING.md)

## License

This project is a combination of two open-source projects, each with its own license:

*   **Metabase:** Released under the AGPL. See the [Metabase license](https://github.com/metabase/metabase/blob/master/LICENSE.txt) for details.
*   **Superset:** Released under the Apache License 2.0. See the [Superset license](https://github.com/apache/superset/blob/master/LICENSE.txt) for details.

Any new code created specifically for this hybrid project will be released under the MIT license.
