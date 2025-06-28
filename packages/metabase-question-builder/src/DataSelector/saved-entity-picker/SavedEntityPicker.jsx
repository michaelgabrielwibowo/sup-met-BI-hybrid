import { useCallback, useMemo, useState } from "react";
import _ from "underscore";

// import { Tree } from "metabase/common/components/tree"; // Will replace with simple list
import CS from "../../css/core/index.css";
// import Collections, { PERSONAL_COLLECTIONS, buildCollectionTree } from "metabase/entities/collections"; // Replaced with mock data
// import { connect } from "metabase/lib/redux"; // Removed Redux
// import { Box, Icon } from "metabase/ui"; // Replaced with simple div/img

import SavedEntityList from "./SavedEntityList";
import SavedEntityPickerS from "./SavedEntityPicker.module.css";
import { CARD_INFO } from "./constants";
// import { findCollectionById } from "./utils"; // Will simplify collection logic

// Mock data for collections
const mockCollections = [
  { id: 1, name: "My Collection", personal_owner_id: 1, schemaName: "My Collection" },
  { id: 2, name: "Another Collection", personal_owner_id: 2, schemaName: "Another Collection" },
  { id: null, name: "Root Collection", schemaName: "Everything else" },
];

const mockCurrentUser = { id: 1, is_superuser: true };

function SavedEntityPicker({
  type,
  onBack,
  onSelect,
  
  
  const collectionTree = useMemo(() => {
    // Simplified collection tree for now
    return mockCollections.map(collection => ({
      ...collection,
      icon: "folder",
      children: []
    }));
  }, []);

  const initialCollection = useMemo(
    () => collectionTree.find(c => c.id === collectionId) || collectionTree[0],
    [collectionTree, collectionId],
  );

  const [selectedCollection, setSelectedCollection] =
    useState(initialCollection);

  const handleSelect = useCallback((collection) => {
    setSelectedCollection(collection);
  }, []);

  return (
    <div className={SavedEntityPickerS.SavedEntityPickerRoot}>
      <div className={SavedEntityPickerS.CollectionsContainer}>
        <a
          className={SavedEntityPickerS.BackButton}
          onClick={onBack}
          data-testid="saved-entity-back-navigation"
        >
          {/* <Icon name="chevronleft" className={CS.mr1} /> */}
          <span style={{ marginRight: '0.25rem' }}>&lt;</span>
          {CARD_INFO[type].title}
        </a>
        <div style={{ margin: '0.5rem 0' }} data-testid="saved-entity-collection-tree">
          {/* Replaced Tree with a simple list for now */}
          <ul>
            {collectionTree.map(collection => (
              <li key={collection.id} onClick={() => handleSelect(collection)}>
                {collection.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SavedEntityList
        type={type}
        collection={selectedCollection}
        selectedId={tableId}
        databaseId={databaseId}
        onSelect={onSelect}
      />
    </div>
  );
}



// Removed Redux connect and data loading HOCs
export default SavedEntityPicker;
