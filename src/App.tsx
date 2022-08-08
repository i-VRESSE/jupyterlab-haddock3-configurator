import React, { useEffect } from 'react';
import {
  CatalogPanel,
  FormActions,
  GridArea,
  NodePanel,
  WorkflowClear,
  WorkflowPanel
} from '@i-vresse/wb-core';
import { useSetCatalog } from '@i-vresse/wb-core/dist/store';
import { prepareCatalog } from '@i-vresse/wb-core/dist/catalog';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@i-vresse/wb-form/dist/index.css';

function App(): JSX.Element {
  const setCatalog = useSetCatalog();
  useEffect(() => {
    const catalog = {
      title: 'Some title',
      global: {
        schema: {
          type: 'object',
          properties: {
            parameterY: {
              type: 'string'
            }
          }
        },
        uiSchema: {}
      },
      categories: [
        {
          name: 'cat1',
          description: 'First category'
        }
      ],
      nodes: [
        {
          category: 'cat1',
          description: 'Description of somenode',
          id: 'somenode',
          label: 'Some node',
          schema: {
            type: 'object',
            properties: {
              parameterX: {
                type: 'string'
              }
            }
          },
          uiSchema: {}
        }
      ],
      examples: {}
    };
    setCatalog(prepareCatalog(catalog)); // On mount configure catalog
  }, []);
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
        <span>Use ctrl-s to save</span>
        <WorkflowClear />
      </GridArea>
      <GridArea className="action-row" area="node-actions">
        <FormActions />
      </GridArea>
    </div>
  );
}
export default App;
