import { Wrapper } from '@i-vresse/wb-core';
import { ReactWidget } from '@jupyterlab/apputils';
import {
  DocumentModel,
  DocumentRegistry,
  DocumentWidget
} from '@jupyterlab/docregistry';
import * as React from 'react';

import App from './App';

export class Haddock3ConfiguratorWidget extends ReactWidget {
  private _context: DocumentRegistry.IContext<DocumentModel>;

  constructor(context: DocumentRegistry.IContext<DocumentModel>) {
    super();
    this._context = context;
  }

  render(): JSX.Element {
    console.log(this._context);
    const context = this._context;

    function onSave(content: string) {
      debugger
      context.model.fromString(content);
    }

    return (
      <Wrapper>
        <App onSave={onSave} content={context.model.toJSON()} />
      </Wrapper>
    );
  }
}

export class H3cDocumentWidget extends DocumentWidget<
  Haddock3ConfiguratorWidget,
  DocumentModel
> {}
