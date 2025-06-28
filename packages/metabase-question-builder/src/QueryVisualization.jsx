/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTimeout } from "react-use";
// import { c, t } from "ttag"; // Internationalization, replaced with string literals
const t = (str) => str;
const c = (str) => (str) => str;

// import EmptyCodeResult from "assets/img/empty-states/code.svg"; // Asset, needs to be handled later
import LoadingSpinner from "./common/components/LoadingSpinner";
// import CS from "./css/core/index.css"; // Removed CSS module
// import QueryBuilderS from "./css/query_builder.module.css"; // Removed CSS module
import { isMac } from "./lib/browser";
// Placeholder for now, will need to be replaced with actual UI components
const Box = (props) => <div {...props} />;
const Flex = (props) => <div {...props} />;
const Stack = (props) => <div {...props} />;
const Text = (props) => <div {...props} />;
const Title = (props) => <div {...props} />;

// Placeholder for useSelector, will need to be replaced with actual data fetching
const useSelector = (selector) => {
  if (selector.name === "getWhiteLabeledLoadingMessageFactory") {
    return (isSlow) => (isSlow ? "Still loading..." : "Loading...");
  }
  return () => {};
};
import * as Lib from "./metabase-lib";
import { HARD_ROW_LIMIT } from "./metabase-lib/v1/queries/utils";

import RunButtonWithTooltip from "./RunButtonWithTooltip";
import { VisualizationError } from "./VisualizationError";
import VisualizationResult from "./VisualizationResult";
import Warnings from "./Warnings";

const SLOW_MESSAGE_TIMEOUT = 4000;

export default function QueryVisualization(props) {
  const {
    className,
    question,
    isRunnable,
    isRunning,
    isObjectDetail,
    isResultDirty,
    isNativeEditorOpen,
    result,
    maxTableRows = HARD_ROW_LIMIT,
  } = props;

  const canRun = Lib.canRun(question.query(), question.type());
  const [warnings, setWarnings] = useState([]);

  return (
    <div
      className={cx(className, CS.relative, CS.stackingContext, CS.fullHeight)}
    >
      {isRunning ? (
        <VisualizationRunningState className={cx(CS.spread, CS.z2)} />
      ) : null}
      <VisualizationDirtyState
        {...props}
        hidden={
          !canRun ||
          !isResultDirty ||
          !isRunnable ||
          isRunning ||
          isNativeEditorOpen ||
          result?.error
        }
        className={cx(CS.spread, CS.z2)}
      />
      {!isObjectDetail && (
        <Warnings
          warnings={warnings}
          className={cx(CS.absolute, CS.top, CS.right, CS.mt2, CS.mr2, CS.z2)}
          size={18}
        />
      )}
      <div
        className={cx(
          CS.spread,
          QueryBuilderS.Visualization,
          {
            [QueryBuilderS.VisualizationLoading]: isRunning,
          },
          CS.z1,
        )}
        data-testid="query-visualization-root"
      >
        {result?.error ? (
          <VisualizationError
            className={CS.spread}
            error={result.error}
            errorType={result.error_type}
            via={result.via}
            question={question}
            duration={result.duration}
          />
        ) : result?.data ? (
          <VisualizationResult
            {...props}
            maxTableRows={maxTableRows}
            className={CS.spread}
            onUpdateWarnings={setWarnings}
          />
        ) : !isRunning ? (
          <VisualizationEmptyState
            className={CS.spread}
            isCompact={isNativeEditorOpen}
          >
            {t`Here's where your results will appear`}
          </VisualizationEmptyState>
        ) : null}
      </div>
    </div>
  );
}

const VisualizationEmptyState = ({ isCompact, children }) => {
  const keyboardShortcut = getRunQueryShortcut();

  return (
    <Flex
      w="100%"
      h="100%"
      align={isCompact ? "flex-start" : "center"}
      justify="center"
      mt={isCompact ? "3rem" : "auto"}
    >
      <Stack maw="25rem" gap={0} ta="center" align="center">
        <Box maw="3rem" mb="0.75rem">
          {/* <img src={EmptyCodeResult} alt="Code prompt icon" /> */}
          <div style={{ width: '3rem', height: '3rem', backgroundColor: 'lightgray' }} />
        </Box>
        <Text c="text-medium">
          {c("{0} refers to the keyboard shortcut")
            .jt`To run your code, click on the Run button or type ${(
            <b key="shortcut">({keyboardShortcut})</b>
          )}`}
        </Text>
        <Text c="text-medium">{children}</Text>
      </Stack>
    </Flex>
  );
};

export function VisualizationRunningState({ className = "" }) {
  const [isSlow] = useTimeout(SLOW_MESSAGE_TIMEOUT);

  const getLoadingMessage = useSelector(getWhiteLabeledLoadingMessageFactory);

  // show the slower loading message only when the loadingMessage is
  // not customized
  const message = getLoadingMessage(isSlow());

  return (
    <Flex
      className={cx(className, QueryBuilderS.Overlay)}
      c="brand"
      direction="column"
      justify="center"
      align="center"
    >
      <LoadingSpinner />
      <Title c="brand" order={3} mt="lg">
        {message}
      </Title>
    </Flex>
  );
}

export const VisualizationDirtyState = ({
  className,
  result,
  isRunning,
  isResultDirty,
  runQuestionQuery = () => console.log("Mock runQuestionQuery"),
  cancelQuery = () => console.log("Mock cancelQuery"),
  hidden,
}) => {
  const keyboardShortcut = getRunQueryShortcut();

  const handleClick = () => {
    if (!hidden) {
      if (isRunning) {
        cancelQuery();
      } else {
        runQuestionQuery();
      }
    }
  };

  return (
    <Flex
      className={cx(className, QueryBuilderS.Overlay, {
        [QueryBuilderS.OverlayActive]: !hidden,
        [QueryBuilderS.OverlayHidden]: hidden,
      })}
      direction="column"
      justify="center"
      align="center"
      gap="sm"
      data-testid="run-button-overlay"
      onClick={handleClick}
    >
      <RunButtonWithTooltip
        className="shadowed"
        iconSize={32}
        circular
        hidden={hidden}
        isRunning={isRunning}
        isDirty={isResultDirty}
      />
      {!hidden && <Text c="text-medium">{keyboardShortcut}</Text>}
    </Flex>
  );
};

function getRunQueryShortcut() {
  return isMac() ? t`⌘ + return` : t`Ctrl + enter`;
}
