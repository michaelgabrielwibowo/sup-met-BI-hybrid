import { Fragment, useCallback, useMemo, useState } from "react";
// // import { t } from "ttag"; // Internationalization, replaced with string literals
const t = (str) => str; // Internationalization, replaced with string literals
const t = (str) => str;

// import { skipToken, useListCollectionItemsQuery } from "metabase/api"; // Replaced with mock data
import EmptyState from "../../common/components/EmptyState";
import { LoadingAndErrorWrapper } from "../../common/components/LoadingAndErrorWrapper";
// import SelectList from "metabase/common/components/SelectList"; // Replaced with simple ul/li
// import { PERSONAL_COLLECTIONS } from "metabase/entities/collections/constants"; // Replaced with mock data
// import { PLUGIN_MODERATION } from "metabase/plugins"; // Removed Metabase-specific plugin
// import { Box } from "metabase/ui"; // Replaced with simple div
import { getQuestionVirtualTableId } from "../../metabase-lib/v1/metadata/utils/saved-questions";
// import type { CardType, Collection, DatabaseId } from "metabase-types/api"; // Removed Metabase-specific types
// import { SortDirection } from "metabase-types/api/sorting"; // Removed Metabase-specific types

import SavedEntityListS from "./SavedEntityList.module.css";
import { CARD_INFO } from "./constants";

// Mock data for collection items
const mockCollectionItems = [
  { id: 1, name: "Mock Question 1", moderated_status: null, database_id: 1 },
  { id: 2, name: "Mock Question 2", moderated_status: null, database_id: 1 },
];

// Mock useListCollectionItemsQuery hook
const useListCollectionItemsQuery = (query) => {
  return {
    data: { data: mockCollectionItems },
    error: null,
    isFetching: false,
  };
};

// Mock PERSONAL_COLLECTIONS
const PERSONAL_COLLECTIONS = { id: "personal" };

// Mock SelectList and SelectList.Item
const SelectList = ({ children, className }) => <ul className={className}>{children}</ul>;
SelectList.Item = ({ children, className, isSelected, size, name, icon, onSelect, rightIcon }) => (
  <li className={className} onClick={onSelect} style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
    {icon && <span style={{ marginRight: '0.5rem' }}>{icon.name}</span>}
    {name}
    {rightIcon && <span style={{ marginLeft: '0.5rem' }}>{rightIcon}</span>}
  </li>
);

// Mock Box
const Box = ({ children, className, m, p, w }) => <div className={className} style={{ margin: m, padding: p, width: w }}>{children}</div>;

// Mock Icon
const Icon = ({ name, className }) => <span className={className}>{name}</span>;

// Mock PLUGIN_MODERATION
const PLUGIN_MODERATION = {
  getStatusIcon: (status) => null, // For now, always return null
};

interface SavedEntityListProps {
  type: any; // Simplified type
  selectedId: string;
  databaseId: any; // Simplified type
  collection?: any; // Simplified type
  onSelect: (tableOrModelId: string) => void;
}

const SavedEntityList = ({
  type,
  selectedId,
  databaseId,
  collection,
  onSelect,
}: SavedEntityListProps): JSX.Element => {
  const emptyState = (
    <Box m="7.5rem 0">
      <EmptyState message={t`Nothing here`} />
    </Box>
  );

  const isVirtualCollection = collection?.id === PERSONAL_COLLECTIONS.id;

  const { data, error, isFetching } = useListCollectionItemsQuery(
    collection && !isVirtualCollection
      ? {
          id: collection.id,
          models: [CARD_INFO[type].model],
          sort_column: "name",
          // sort_direction: SortDirection.Asc, // Removed Metabase-specific enum
        }
      : null, // Changed skipToken to null
  );
  const list = data?.data ?? [];
  const filteredList = databaseId
    ? // When `databaseId` is provided, we're joining data, so we need to filter out items that don't belong to the current database
      list.filter((collectionItem) => collectionItem.database_id === databaseId)
    : list;

  return (
    <Box p="sm" w="100%">
      <SelectList className={SavedEntityListS.SavedEntityListRoot}>
        <LoadingAndErrorWrapper
          className={SavedEntityListS.LoadingWrapper}
          loading={!collection || isFetching}
          error={error}
        >
          <Fragment>
            {filteredList.map((collectionItem) => {
              const { id, name, moderated_status } = collectionItem;
              const virtualTableId = getQuestionVirtualTableId(id);

              return (
                <SelectList.Item
                  classNames={{
                    root: SavedEntityListS.SavedEntityListItem,
                    icon: SavedEntityListS.SavedEntityListItemIcon,
                  }}
                  key={id}
                  id={id}
                  isSelected={selectedId === virtualTableId}
                  size="small"
                  name={name}
                  icon={{
                    name: CARD_INFO[type].icon,
                    size: 16,
                  }}
                  onSelect={() => onSelect(virtualTableId)}
                  rightIcon={PLUGIN_MODERATION.getStatusIcon(moderated_status)}
                />
              );
            })}
            {filteredList.length === 0 ? emptyState : null}
          </Fragment>
          {isVirtualCollection && emptyState}
        </LoadingAndErrorWrapper>
      </SelectList>
    </Box>
  );
};

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default SavedEntityList;
