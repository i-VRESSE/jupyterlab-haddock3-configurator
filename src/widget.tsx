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
import { FileWidgetContext } from './FileWidgetContext';

export class Haddock3ConfiguratorWidget extends ReactWidget {
  private _context: DocumentRegistry.IContext<DocumentModel>;
  private _manager: IDocumentManager;
  private _baseUrl = '';

  constructor(
    context: DocumentRegistry.IContext<DocumentModel>,
    manager: IDocumentManager,
    baseUrl: string
  ) {
    super();
    this._context = context;
    this._manager = manager;
    this._baseUrl = baseUrl;
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
    const contextValue = {
      manager: this._manager,
      baseUrl: this._baseUrl
    };
    return (
      <Wrapper>
        <FileWidgetContext.Provider value={contextValue}>
          <App onSave={onSave} content={bodyCfg} />
        </FileWidgetContext.Provider>
      </Wrapper>
    );
  }
}

export class H3cDocumentWidget extends DocumentWidget<
  Haddock3ConfiguratorWidget,
  DocumentModel
> {}
