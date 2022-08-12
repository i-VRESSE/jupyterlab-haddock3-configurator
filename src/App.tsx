import React, { useEffect } from 'react';
import {
  CatalogPanel,
  FormActions,
  GridArea,
  NodePanel,
  WorkflowClear,
  WorkflowPanel
} from '@i-vresse/wb-core';
import { parseWorkflow } from '@i-vresse/wb-core/dist/toml';
import {
  useCatalog,
  useGlobalFormData,
  useSelectedNodeFormData,
  useSetCatalog,
  useText,
  useWorkflow
} from '@i-vresse/wb-core/dist/store';
import {
  globalParameterKeys,
  prepareCatalog
} from '@i-vresse/wb-core/dist/catalog';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@i-vresse/wb-form/dist/index.css';
// This file copied from https://github.com/i-VRESSE/workflow-builder/blob/main/packages/haddock3_catalog/public/catalog/haddock3.guru.yaml
// then was converted from yaml to json and its example entry removed
import catalogJSON from './haddock3.guru.json';
import { TomlObjectSchema } from '@i-vresse/wb-core/dist/types';

function App({
  onSave,
  content
}: {
  onSave: (content: string) => void;
  content: string;
}): JSX.Element {
  const setCatalog = useSetCatalog();
  useEffect(() => {
    setCatalog(prepareCatalog(catalogJSON)); // On mount configure catalog
  }, []);

  const text = useText();
  function onMySave() {
    onSave(text);
  }

  const catalog = useCatalog();
  const setGlobal = useGlobalFormData()[1];
  const setNode = useSelectedNodeFormData()[1];
  const { addNodeToWorkflow, selectNode } = useWorkflow();
  useEffect(() => {
    async function parseContent(myContent: string) {
      // TODO move to loadText(content) in @i-vresse/core:store:useWorkflow()
      const globalKeys = globalParameterKeys(catalog.global);
      const tomlSchema4global = catalog.global.tomlSchema ?? {};
      const tomlSchema4nodes: Record<string, TomlObjectSchema> = {};
      catalog.nodes.forEach(n => (tomlSchema4nodes[n.id] = n.tomlSchema ?? {}));

      const { nodes, global } = await parseWorkflow(
        myContent,
        globalKeys,
        tomlSchema4global,
        tomlSchema4nodes
      );
      setGlobal(global);
      nodes.forEach((n, i) => {
        addNodeToWorkflow(n.type);
        selectNode(i);
        setNode(n.parameters);
      });
      // TODO load files
    }
    if (content) {
      parseContent(content).catch(console.error);
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
        <button className="btn btn-primary" onClick={onMySave}>
          Save
        </button>
        <WorkflowClear />
      </GridArea>
      <GridArea className="action-row" area="node-actions">
        <FormActions />
      </GridArea>
    </div>
  );
}
export default App;
