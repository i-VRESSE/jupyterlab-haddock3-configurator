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
    this._context.ready.then(value => {
      this.update();
    });
  }

  render(): JSX.Element {
    const context = this._context;

    function onSave(content: string) {
      context.model.fromString(content);
    }
    const bodyCfg = context.model.toString();
    return (
      <Wrapper>
        <App onSave={onSave} content={bodyCfg} />
      </Wrapper>
    );
  }
}

export class H3cDocumentWidget extends DocumentWidget<
  Haddock3ConfiguratorWidget,
  DocumentModel
> {}
