export const api = {
  fetchDatabases: async (query) => {
    console.log("Fetching databases with query:", query);
    return [
      { id: 1, name: "Sample Database", is_saved_questions: false },
      { id: 2, name: "Saved Questions", is_saved_questions: true },
    ];
  },
  fetchSchemas: async (dbId) => {
    console.log("Fetching schemas for database:", dbId);
    if (dbId === 1) {
      return [
        { id: "schema1", name: "PUBLIC", database: { id: 1 } },
        { id: "schema2", name: "ANOTHER_SCHEMA", database: { id: 1 } },
      ];
    } else if (dbId === 2) {
      return [
        { id: "saved_questions_schema", name: "Saved Questions", database: { id: 2 } },
      ];
    }
    return [];
  },
  fetchSchemaTables: async (schemaId) => {
    console.log("Fetching tables for schema:", schemaId);
    if (schemaId === "schema1") {
      return [
        { id: 101, name: "Orders", schema: { id: "schema1" }, db_id: 1 },
        { id: 102, name: "Products", schema: { id: "schema1" }, db_id: 1 },
      ];
    } else if (schemaId === "schema2") {
      return [
        { id: 103, name: "Customers", schema: { id: "schema2" }, db_id: 1 },
      ];
    } else if (schemaId === "saved_questions_schema") {
      return [
        { id: "card_1", name: "My Saved Question", schema: { id: "saved_questions_schema" }, db_id: 2 },
      ];
    }
    return [];
  },
  fetchFields: async (tableId) => {
    console.log("Fetching fields for table:", tableId);
    if (tableId === 101) {
      return [
        { id: 1001, name: "Order ID", table: { id: 101 } },
        { id: 1002, name: "Product ID", table: { id: 101 } },
      ];
    } else if (tableId === 102) {
      return [
        { id: 1003, name: "Product Name", table: { id: 102 } },
        { id: 1004, name: "Price", table: { id: 102 } },
      ];
    } else if (tableId === 103) {
      return [
        { id: 1005, name: "Customer ID", table: { id: 103 } },
        { id: 1006, name: "Customer Name", table: { id: 103 } },
      ];
    } else if (tableId === "card_1") {
      return [
        { id: "card_1_field_1", name: "Question Field 1", table: { id: "card_1" } },
      ];
    }
    return [];
  },
  fetchQuestion: async (id) => {
    console.log("Fetching question:", id);
    return { type: () => "question" };
  },
  search: async (query) => {
    console.log("Searching with query:", query);
    return { available_models: ["dataset", "metric"] };
  },
};
