import React, { useEffect } from 'react';
import {
  CatalogPanel,
  FormActions,
  NodePanel,
  WorkflowPanel,
} from '@i-vresse/wb-core';
import { useSetCatalog } from '@i-vresse/wb-core/dist/store';
import { prepareCatalog } from '@i-vresse/wb-core/dist/catalog';
// import "bootstrap/dist/css/bootstrap.min.css";
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
    <table>
      <tr>
        <td>
          <CatalogPanel />
        </td>
        <td>
          <WorkflowPanel />
        </td>
        <td style={{ verticalAlign: 'top' }}>
          <NodePanel />
          <FormActions />
        </td>
      </tr>
    </table>
  );
}
export default App;
