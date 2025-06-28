const SUPERSET_API_BASE_URL = 'http://localhost:8088/api/v1';

// Helper function for GET requests
async function get(endpoint, params = {}) {
  const url = new URL(`${SUPERSET_API_BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  // TODO: Handle authentication (e.g., Authorization header)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization header if needed, e.g.:
      // 'Authorization': `Bearer ${localStorage.getItem('superset_token')}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Superset API Error: ${response.status} ${errorData.message || response.statusText}`);
  }
  return response.json();
}

// Helper function for POST requests
async function post(endpoint, body = {}) {
  const url = `${SUPERSET_API_BASE_URL}${endpoint}`;

  // TODO: Handle authentication
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('superset_token')}`
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Superset API Error: ${response.status} ${errorData.message || response.statusText}`);
  }
  return response.json();
}

export const supersetAPI = {
  fetchDatabases: async () => {
    // Assuming GET /api/v1/database/ returns a list of databases
    // The response structure might be like: { result: [{ id: 1, database_name: '...' }, ...] }
    const data = await get('/database/');
    // TODO: Adapt this to the actual response structure from Superset
    return data.result || [];
  },

  fetchSchemas: async (databaseId) => {
    // Assuming GET /api/v1/database/{databaseId}/schemas/
    // Response: { result: ['schema1', 'schema2'] }
    const data = await get(`/database/${databaseId}/schemas/`);
    // TODO: Adapt this to the actual response structure
    return data.result ? data.result.map(name => ({ name, database_id: databaseId })) : [];
  },

  fetchTables: async (databaseId, schemaName) => {
    // Fetching datasets as tables. This might need adjustment.
    // Using q parameter for filtering by database and schema
    // Example from Superset docs: (filters:!((col:schema,opr:eq,value:'public'),(col:database,opr:rel_o_m,value:(id:1))))
    const q = {
      filters: [
        { col: 'database', opr: 'rel_o_m', value: databaseId },
        { col: 'schema', opr: 'eq', value: schemaName },
      ],
    };
    const data = await get('/dataset/', { q: JSON.stringify(q) });
    // TODO: Adapt this to the actual response structure, e.g., data.result might contain datasets
    return (data.result || []).map(table => ({
        id: table.id,
        name: table.table_name,
        db_id: databaseId,
        schema: schemaName,
    }));
  },

  fetchColumns: async (tableId) => {
    // Assuming GET /api/v1/dataset/{tableId} returns dataset details including columns
    // Response structure might be like: { result: { columns: [{ column_name: 'col1', type: 'VARCHAR' }, ...] } }
    const data = await get(`/dataset/${tableId}`);
    // TODO: Adapt this to the actual response structure
    return (data.result && data.result.columns) ? data.result.columns.map(col => ({
      id: col.id || col.column_name, // Prefer ID if available
      name: col.column_name,
      type: col.type,
      table_id: tableId,
    })) : [];
  },

  executeSql: async ({ databaseId, sql, schema }) => {
    // Using POST /api/v1/sqllab/execute/
    const payload = {
      database_id: databaseId,
      sql: sql,
      schema: schema, // May or may not be needed depending on Superset config / query
      // Other parameters like client_id, run_async, select_as_cta, etc., might be required.
      // For simplicity, starting with basic ones.
    };
    // This endpoint typically initiates execution and returns a query ID.
    // Actual results need to be fetched separately using the query ID.
    // For now, this is a placeholder for the more complex flow.
    console.warn('executeSql is a simplified placeholder. Full SQL Lab flow is more complex.');
    return await post('/sqllab/execute/', payload);
    // A more complete implementation would involve polling /sqllab/results/{queryId}
  },

  fetchChartData: async (formData) => {
    // Using POST /api/v1/chart/data with chart form_data
    // formData is the specific payload Superset uses to define a chart query
    // This is used by Superset's explore view and embeddable charts
    const payload = {
      datasource: { id: formData.datasource_id, type: formData.datasource_type || 'table' },
      queries: [
        {
          // This structure depends heavily on the chart type and Superset's query object
          // For example:
          metrics: formData.metrics || [],
          groupby: formData.groupby || [],
          filters: formData.filters || [],
          row_limit: formData.row_limit || 1000,
          // ... other query parameters
        }
      ],
      // result_format: 'json', // Optional, defaults to json
      // result_type: 'full', // Optional, defaults to full
    };
    // The actual payload for /api/v1/chart/data can be quite complex.
    // This is a simplified placeholder.
    // One way to get the correct payload is to inspect network requests in Superset's Explore view.
    return await post('/chart/data', { form_data: JSON.stringify(formData) });
  }
};
