import React, { useState } from 'react';
import { QueryVisualization, DataSelector } from 'metabase-question-builder';

// Placeholder for Superset visualizations area
const SupersetVisualizationArea = () => {
  return (
    <div style={{ border: '2px dashed blue', padding: '20px', margin: '10px', textAlign: 'center' }}>
      <h3>Superset Visualization Area (Advanced Mode)</h3>
      <p>
        In a real implementation, this area would allow users to select,
        configure, and display visualizations directly from Superset.
      </p>
      <p>
        This might involve using the Superset Embedded SDK or fetching chart data
        via <code>/api/v1/chart/data</code> and rendering with a library.
      </p>
    </div>
  );
};

function App() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({ query: () => ({}), type: () => "" });

  // This function would be called by DataSelector or other components
  // when a new question/query is formulated in Simple Mode.
  // For now, it's just a placeholder to update the visualization.
  const handleQuestionUpdate = (newQuestion) => {
    // In a real app, newQuestion would come from the Metabase Question Builder components
    // For example, after a user builds a query.
    // setCurrentQuestion(newQuestion);
    console.log("New question formulated (placeholder):", newQuestion);
    // For testing, let's imagine a simple question object structure
    // that QueryVisualization might expect after data is loaded.
    // This part is still highly dependent on the actual data flow from DataSelector
    // and the result of runQuestionQuery.
    setCurrentQuestion({
        display: "table", // or "bar", "line" etc.
        data: { // This structure comes from the transformed Superset API response
            cols: [
                { name: "col1", display_name: "Column 1", base_type: "type/Text" },
                { name: "col2", display_name: "Column 2", base_type: "type/Integer" },
            ],
            rows: [
                ["value1", 100],
                ["value2", 200],
            ],
        },
        // other necessary properties for Metabase's QueryVisualization
        query: () => ({ source_table: 123 }), // mock
        databaseId: () => 1, // mock
        type: () => "query" // mock
    });
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Hybrid BI App</h1>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isAdvancedMode}
              onChange={() => setIsAdvancedMode(!isAdvancedMode)}
            />
            Advanced Mode (Superset Visualizations)
          </label>
        </div>
      </div>

      {isAdvancedMode ? (
        <SupersetVisualizationArea />
      ) : (
        <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
          <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
            <h2>Data Selector (Simple Mode)</h2>
            {/*
              DataSelector would need to be enhanced to eventually call
              handleQuestionUpdate or similar when a query is ready.
              The `runQuestionQuery` from `api.js` would be invoked by
              QueryVisualization or a controller component.
            */}
            <DataSelector
              onQuestionUpdate={handleQuestionUpdate} // Hypothetical prop
            />
          </div>
          <div style={{ flex: 2, padding: '10px', overflowY: 'auto' }}>
            <h2>Query Visualization (Simple Mode)</h2>
            <QueryVisualization
              question={currentQuestion}
              // onRunQuery={api.runQuestionQuery} // QueryVisualization might take this directly
                                                // or it's handled internally based on `question` prop changes.
                                                // The current Metabase QB components often trigger runs internally.
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;