import React, { useContext, useEffect } from 'react';

import {
  CatalogPanel,
  FormActions,
  GridArea,
  NodePanel,
  WorkflowClear,
  WorkflowPanel
} from '@i-vresse/wb-core';
import {
  globalParameterKeys,
  prepareCatalog
} from '@i-vresse/wb-core/dist/catalog';
import {
  useCatalog,
  useGlobalFormData,
  useSelectedNodeFormData,
  useSetCatalog,
  useText,
  useWorkflow
} from '@i-vresse/wb-core/dist/store';
import { parseWorkflow } from '@i-vresse/wb-core/dist/toml';
import { IParameters, TomlObjectSchema } from '@i-vresse/wb-core/dist/types';
import '@i-vresse/wb-form/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { JSONSchema7 } from 'json-schema';
import { toast } from 'react-toastify';

// This file copied from https://github.com/i-VRESSE/workflow-builder/blob/main/packages/haddock3_catalog/public/catalog/haddock3.guru.yaml
// then was converted from yaml to json and its example entry removed
import { FileWidget } from './FileWidget';
import catalogJSON from './haddock3.guru.json';
import { path2dataurl } from './path2dataurl';
import { FileWidgetContext } from './FileWidgetContext';

function App({
  onSave,
  content
}: {
  onSave: (content: string) => void;
  content: string;
}): JSX.Element {
  const context = useContext(FileWidgetContext);
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
      const schema4nodes: Record<string, JSONSchema7> = {};
      catalog.nodes.forEach(n => {
        tomlSchema4nodes[n.id] = n.tomlSchema ?? {};
        schema4nodes[n.id] = n.schema;
      });

      const { nodes, global } = await parseWorkflow(
        myContent,
        globalKeys,
        tomlSchema4global,
        tomlSchema4nodes
      );
      const globalWithFiles = await injectFiles(
        global,
        catalog.global.schema,
        context?.base ?? ''
      );

      setGlobal(globalWithFiles);

      let i = 0;
      for (const n of nodes) {
        addNodeToWorkflow(n.type);
        selectNode(i);
        const nodeParametersWithFiles = await injectFiles(
          n.parameters,
          schema4nodes[n.type],
          context?.base ?? ''
        );
        setNode(nodeParametersWithFiles);
        i++;
      }
    }
    if (content) {
      parseContent(content).catch(e => {
        console.error(e);
        toast.error(`Failed to load config file: ${e}`);
      });
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
        <NodePanel widgets={{ FileWidget }} />
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

async function injectFiles(
  parameters: IParameters,
  schema: JSONSchema7,
  base: string
) {
  if (!schema.properties) {
    return parameters;
  }
  const newParameters: IParameters = {};
  for (const entry of Object.entries(schema.properties)) {
    const [propKey, propSchema] = entry;
    if (typeof propSchema === 'boolean' || Array.isArray(propSchema)) {
      continue;
    }
    const propValue = parameters[propKey];
    if (propValue === undefined) {
      // Only care about keys that are in parameters
      continue;
    }
    const isntBoolSchema = typeof propSchema !== 'boolean';
    const isUriSchema =
      isntBoolSchema &&
      propSchema.type === 'string' &&
      propSchema.format === 'uri-reference';
    const isUriArraySchema =
      isntBoolSchema &&
      propSchema.type === 'array' &&
      propSchema.items &&
      typeof propSchema.items !== 'boolean' &&
      !Array.isArray(propSchema.items) &&
      propSchema.items.type === 'string' &&
      propSchema.items.format === 'uri-reference';
    // On write parameters, files/directories are created by running workflow, they should not exist
    // TODO replace haddock3 specific key with something generic
    if (propKey === 'run_dir') {
      newParameters[propKey] = propValue;
    } else if (
      isUriSchema &&
      typeof propValue === 'string' &&
      !propValue.startsWith('data:')
    ) {
      // handle p[k] = 'bla.pdb'
      const newPropValue = await path2dataurl(propValue, base);
      newParameters[propKey] = newPropValue;
    } else if (isUriArraySchema && Array.isArray(propValue)) {
      // handle p[k] = ['bla.pdb']
      const newItems = [];
      for (const item of propValue) {
        if (typeof item === 'string' && !item.startsWith('data:')) {
          const newItem = await path2dataurl(item, base);
          newItems.push(newItem);
        } else {
          newItems.push(item);
        }
      }
      newParameters[propKey] = newItems;
    } else {
      // TODO handle uris in more places like p[k1][k2] or p[k1][0][k2]
      newParameters[propKey] = propValue;
    }
  }
  return newParameters;
}
