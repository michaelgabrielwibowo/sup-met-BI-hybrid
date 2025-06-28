import React from 'react';
import { QueryVisualization, DataSelector } from 'metabase-question-builder';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>Hybrid BI App</h1>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '10px' }}>
          <h2>Data Selector</h2>
          <DataSelector />
        </div>
        <div style={{ flex: 2, padding: '10px' }}>
          <h2>Query Visualization</h2>
          <QueryVisualization question={{ query: () => ({}), type: () => "" }} />
        </div>
      </div>
    </div>
  );
}

export default App;