import { supersetAPI } from '../../../ui/src/utils/supersetApi'; // Adjusted path

export const api = {
  fetchDatabases: async (query) => {
    console.log("Fetching databases from Superset with query:", query);
    try {
      const databases = await supersetAPI.fetchDatabases();
      // Metabase expects: { id: number, name: string, is_saved_questions: boolean }
      // Superset API (assumed): { id: number, database_name: string }
      return databases.map(db => ({
        id: db.id,
        name: db.database_name,
        is_saved_questions: false, // Superset doesn't have a direct 'saved questions' db concept like Metabase
      }));
    } catch (error) {
      console.error("Error fetching databases from Superset:", error);
      return [];
    }
  },

  fetchSchemas: async (dbId) => {
    console.log("Fetching schemas for database from Superset:", dbId);
    try {
      const schemas = await supersetAPI.fetchSchemas(dbId);
      // Metabase expects: { id: string (or unique), name: string, database: { id: number } }
      // Superset API (assumed): { name: string, database_id: number }
      return schemas.map(schema => ({
        id: `${dbId}-${schema.name}`, // Creating a unique ID for schema
        name: schema.name,
        database: { id: dbId },
      }));
    } catch (error) {
      console.error("Error fetching schemas from Superset:", error);
      return [];
    }
  },

  // In Metabase, schemaId is often just the schema name for non-virtual dbs.
  // We'll assume schemaId passed here is the schema name. The dbId is needed for Superset.
  fetchSchemaTables: async (schemaId, dbId) => { // dbId might need to be passed down or inferred
    if (!dbId) {
        console.error("fetchSchemaTables called without dbId, which is required for Superset.");
        // Attempt to infer dbId if schemaId has the compound format, otherwise this will fail.
        // This is a workaround; ideally, the caller (DataSelector) should provide dbId.
        const parts = typeof schemaId === 'string' ? schemaId.split('-') : [];
        if (parts.length > 1 && !isNaN(parseInt(parts[0]))) {
            dbId = parseInt(parts[0]);
            schemaId = parts.slice(1).join('-'); // Reconstruct schema name if it contained hyphens
            console.warn(`Inferred dbId ${dbId} and schemaName ${schemaId} in fetchSchemaTables. This might be unreliable.`);
        } else {
            return [];
        }
    }
    console.log(`Fetching tables for schema '${schemaId}' in database '${dbId}' from Superset`);
    try {
      const tables = await supersetAPI.fetchTables(dbId, schemaId);
      // Metabase expects: { id: number | string, name: string, schema: { id: string }, db_id: number }
      // Superset API (assumed): { id: number, name: string, db_id: number, schema: string }
      return tables.map(table => ({
        id: table.id,
        name: table.name,
        schema: { id: schemaId }, // or table.schema
        db_id: table.db_id,
      }));
    } catch (error) {
      console.error("Error fetching tables from Superset:", error);
      return [];
    }
  },

  fetchFields: async (tableId) => {
    console.log("Fetching fields for table from Superset:", tableId);
    try {
      const columns = await supersetAPI.fetchColumns(tableId);
      // Metabase expects: { id: number | string, name: string, table: { id: number | string } }
      // Superset API (assumed): { id: number | string, name: string, type: string, table_id: number }
      return columns.map(col => ({
        id: col.id,
        name: col.name,
        // Metabase components might need more field details (like type), store it if available
        base_type: col.type, // Storing Superset type as base_type
        table: { id: tableId },
      }));
    } catch (error) {
      console.error("Error fetching fields from Superset:", error);
      return [];
    }
  },

  // This function is crucial for running queries.
  // The Metabase Query Builder generates a query object. We need to translate this
  // into something Superset can execute, likely SQL or Superset's own query context.
  runQuestionQuery: async (question) => {
    console.log("Attempting to run question query via Superset:", question);
    try {
      // This is highly dependent on the structure of `question` from Metabase
      // and how we want to execute it in Superset (raw SQL vs. chart/data API).

      // Option 1: If question can be compiled to SQL (Metabase internal logic)
      if (typeof question.query !== 'function' || typeof question.databaseId !== 'function') {
        console.error("Question object is not structured as expected for SQL execution.");
        return { error: "Invalid question structure for SQL execution." };
      }

      const mbqlQuery = question.query(); // This is Metabase's internal query representation
      const databaseId = question.databaseId(); // Get the target database ID

      // TODO: Implement MBQL to SQL compilation or use a Superset endpoint that accepts a similar structure.
      // For now, this is a major simplification and likely won't work directly.
      // We'd need a robust MBQL -> SQL converter or adapt to Superset's /api/v1/chart/data

      // Placeholder: Assume we have a way to get SQL and the schema
      const sql = `SELECT * FROM some_table LIMIT 10;`; // This needs to be derived from mbqlQuery
      const schema = mbqlQuery.schema; // This is also an assumption

      if (!databaseId) {
        console.error("Database ID is missing from the question.");
        return { error: "Database ID is missing." };
      }

      console.log(`Executing SQL (placeholder) for database ${databaseId}, schema ${schema}: ${sql}`);

      // Using the executeSql from supersetApi.js (which itself is a placeholder for SQL Lab flow)
      // const result = await supersetAPI.executeSql({ databaseId, sql, schema });

      // More likely, we'd use the chart/data endpoint if we can construct the form_data
      // This requires knowing the datasource_id (tableId) and other parameters.
      const tableId = mbqlQuery.source_table; // Assuming this gives the table ID
      if (!tableId) {
          console.error("Source table ID is missing from the MBQL query.");
          return { error: "Source table ID is missing." };
      }

      const formData = {
        datasource_id: tableId,
        datasource_type: 'table', // or 'dataset'
        // ... map MBQL clauses (fields, filters, aggregations, limit) to Superset's form_data ...
        // Example for selecting all columns and limiting:
        all_columns: mbqlQuery.fields ? undefined : true, // If fields are specified, don't use all_columns
        columns: mbqlQuery.fields ? mbqlQuery.fields.map(f => f[1]) : [], // Extract field names
        row_limit: mbqlQuery.limit || 100,
        // This mapping is very complex and specific to MBQL structure
      };

      console.log("Calling supersetAPI.fetchChartData with formData:", formData);
      const queryResult = await supersetAPI.fetchChartData(formData);

      // Transform Superset's result (e.g., queryResult.result[0].data) to Metabase's expected format
      // Metabase expects something like:
      // {
      //   data: {
      //     cols: [{ name: "col1", display_name: "Col 1", base_type: "type/Text" }, ...],
      //     rows: [["val1", "val2"], ...],
      //     results_metadata: { checksum: "...", viz_settings: {...} }
      //   }
      // }
      if (queryResult && queryResult.result && queryResult.result.length > 0) {
        const firstResult = queryResult.result[0];
        return {
          data: {
            cols: firstResult.colnames.map((colname, idx) => ({
              name: colname,
              display_name: colname, // TODO: Get proper display name if available
              base_type: firstResult.coltypes[idx] || "type/Text", // TODO: Map Superset types to Metabase types
            })),
            rows: firstResult.data,
            // results_metadata: { viz_settings: {} } // Optional
          }
        };
      }
      return { error: "No data returned or unexpected format from Superset." };

    } catch (error) {
      console.error("Error running question query via Superset:", error);
      return { error: error.message || "Failed to run query." };
    }
  },

  fetchQuestion: async (id) => {
    // This is for fetching a "saved question" definition.
    // Superset calls these "charts" or uses "saved_query" for SQL Lab.
    // For now, let's assume we are not loading saved questions from Superset in this way.
    console.warn("fetchQuestion (for saved questions) is not fully implemented for Superset yet.");
    // If we were to implement it, it might look like:
    // const chartDetails = await supersetAPI.fetchChartDetails(id); // Needs a supersetAPI method
    // return transformSupersetChartToMetabaseQuestion(chartDetails);
    return { type: () => "question", data: { /* mock or placeholder */ } }; // Placeholder
  },

  search: async (query) => {
    // Superset's search capabilities might be different.
    // It has /api/v1/chart/?q=, /api/v1/dashboard/?q=, /api/v1/dataset/?q=
    // This needs to be mapped to what Metabase search expects.
    console.warn("Search functionality mapping to Superset is a TODO.");
    // Example: search for datasets (tables)
    // const datasets = await supersetAPI.searchDatasets(query); // new method in supersetApi.js
    // return transformSupersetDatasetsToMetabaseSearchItems(datasets);
    return { available_models: ["dataset"] }; // Placeholder
  },
};
