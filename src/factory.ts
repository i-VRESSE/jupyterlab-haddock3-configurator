import { IDocumentManager } from '@jupyterlab/docmanager';
import {
  ABCWidgetFactory,
  DocumentModel,
  DocumentRegistry
} from '@jupyterlab/docregistry';
import { H3cDocumentWidget, Haddock3ConfiguratorWidget } from './widget';

export class H3cFactory extends ABCWidgetFactory<
  H3cDocumentWidget,
  DocumentRegistry.IModel
> {
  private _manager: IDocumentManager | undefined = undefined;

  protected createNewWidget(
    context: DocumentRegistry.IContext<DocumentModel>
  ): H3cDocumentWidget {
    if (this._manager === undefined) {
      throw new Error('No document manager set');
    }
    return new H3cDocumentWidget({
      context,
      content: new Haddock3ConfiguratorWidget(
        context,
        this._manager
      )
    });
  }

  setManager(newManager: IDocumentManager): void {
    this._manager = newManager;
  }
}
