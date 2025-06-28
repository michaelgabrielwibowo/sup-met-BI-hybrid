# Metabase Question Builder (Standalone)

This package contains refactored components from the Metabase frontend, specifically the data selector and query visualization components. It aims to be a standalone module with mocked data fetching, allowing for easier integration into other React applications.

## Usage

```javascript
import { DataSelector, QueryVisualization } from 'metabase-question-builder';

function App() {
  return (
    <div>
      <DataSelector />
      <QueryVisualization />
    </div>
  );
}
```
