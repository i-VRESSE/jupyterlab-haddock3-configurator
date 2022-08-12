import React, { useEffect } from 'react';
import {
  CatalogPanel,
  FormActions,
  GridArea,
  NodePanel,
  WorkflowClear,
  WorkflowPanel
} from '@i-vresse/wb-core';
import {
  useSetCatalog,
  useText,
  useWorkflow
} from '@i-vresse/wb-core/dist/store';
import { prepareCatalog } from '@i-vresse/wb-core/dist/catalog';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@i-vresse/wb-form/dist/index.css';
// This file copied from https://github.com/i-VRESSE/workflow-builder/blob/main/packages/haddock3_catalog/public/catalog/haddock3.guru.yaml
// then was converted from yaml to json and its example entry removed
import catalog from './haddock3.guru.json';

function App({
  onSave,
  content
}: {
  onSave: (content: string) => void;
  content: any;
}): JSX.Element {
  const setCatalog = useSetCatalog();
  useEffect(() => {
    setCatalog(prepareCatalog(catalog)); // On mount configure catalog
  }, []);

  const text = useText();
  function onMySave() {
    onSave(text);
  }

  const { loadWorkflowArchive } = useWorkflow();
  useEffect(() => {
    if (content) {
      debugger
      loadWorkflowArchive(content);
    }
  }, [content]);

  return (
    <div className="page">
      <GridArea area="catalog">
        <CatalogPanel />
      </GridArea>
      <GridArea area="workflow">
        <WorkflowPanel />
      </GridArea>
      <GridArea area="node">
        <NodePanel />
      </GridArea>
      <GridArea className="action-row" area="workflow-actions">
        <button onClick={onMySave}>Save</button>
        <WorkflowClear />
      </GridArea>
      <GridArea className="action-row" area="node-actions">
        <FormActions />
      </GridArea>
    </div>
  );
}
export default App;
