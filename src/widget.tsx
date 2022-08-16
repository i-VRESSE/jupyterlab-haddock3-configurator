import * as React from 'react';

import { Wrapper } from '@i-vresse/wb-core';
import { ReactWidget } from '@jupyterlab/apputils';
import {
  DocumentModel,
  DocumentRegistry,
  DocumentWidget
} from '@jupyterlab/docregistry';
import { IDocumentManager } from '@jupyterlab/docmanager';

import App from './App';
import { DocManagerContext } from './DocManagerContext';

export class Haddock3ConfiguratorWidget extends ReactWidget {
  private _context: DocumentRegistry.IContext<DocumentModel>;
  private _manager: IDocumentManager;

  constructor(
    context: DocumentRegistry.IContext<DocumentModel>,
    manager: IDocumentManager
  ) {
    super();
    this._context = context;
    this._manager = manager;
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
        <DocManagerContext.Provider value={this._manager}>
          <App onSave={onSave} content={bodyCfg} />
        </DocManagerContext.Provider>
      </Wrapper>
    );
  }
}

export class H3cDocumentWidget extends DocumentWidget<
  Haddock3ConfiguratorWidget,
  DocumentModel
> {}
