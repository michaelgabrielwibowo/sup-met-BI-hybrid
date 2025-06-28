import React, { useState, useEffect } from 'react';
import { api } from '../api';

const DataSelector = () => {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    const loadDatabases = async () => {
      const dbs = await api.fetchDatabases({});
      setDatabases(dbs);
    };
    loadDatabases();
  }, []);

  useEffect(() => {
    const loadSchemas = async () => {
      if (selectedDatabase) {
        const scms = await api.fetchSchemas(selectedDatabase.id);
        setSchemas(scms);
        setTables([]);
        setFields([]);
        setSelectedSchema(null);
        setSelectedTable(null);
        setSelectedField(null);
      }
    };
    loadSchemas();
  }, [selectedDatabase]);

  useEffect(() => {
    const loadTables = async () => {
      if (selectedSchema) {
        const tbls = await api.fetchSchemaTables(selectedSchema.id);
        setTables(tbls);
        setFields([]);
        setSelectedTable(null);
        setSelectedField(null);
      }
    };
    loadTables();
  }, [selectedSchema]);

  useEffect(() => {
    const loadFields = async () => {
      if (selectedTable) {
        const flds = await api.fetchFields(selectedTable.id);
        setFields(flds);
        setSelectedField(null);
      }
    };
    loadFields();
  }, [selectedTable]);

  return (
    <div>
      <h3>Select your Data</h3>
      <div>
        <label>Database:</label>
        <select onChange={(e) => setSelectedDatabase(databases.find(db => db.id === parseInt(e.target.value)))}>
          <option value="">--Select Database--</option>
          {databases.map(db => (
            <option key={db.id} value={db.id}>{db.name}</option>
          ))}
        </select>
      </div>

      {selectedDatabase && (
        <div>
          <label>Schema:</label>
          <select onChange={(e) => setSelectedSchema(schemas.find(scm => scm.id === e.target.value))}>
            <option value="">--Select Schema--</option>
            {schemas.map(scm => (
              <option key={scm.id} value={scm.id}>{scm.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedSchema && (
        <div>
          <label>Table:</label>
          <select onChange={(e) => setSelectedTable(tables.find(tbl => tbl.id === parseInt(e.target.value)))}>
            <option value="">--Select Table--</option>
            {tables.map(tbl => (
              <option key={tbl.id} value={tbl.id}>{tbl.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedTable && (
        <div>
          <label>Field:</label>
          <select onChange={(e) => setSelectedField(fields.find(fld => fld.id === parseInt(e.target.value)))}>
            <option value="">--Select Field--</option>
            {fields.map(fld => (
              <option key={fld.id} value={fld.id}>{fld.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedField && (
        <div>
          <h4>Selected:</h4>
          <p>Database: {selectedDatabase?.name}</p>
          <p>Schema: {selectedSchema?.name}</p>
          <p>Table: {selectedTable?.name}</p>
          <p>Field: {selectedField?.name}</p>
        </div>
      )}
    </div>
  );
};

export default DataSelector;