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
  protected createNewWidget(
    context: DocumentRegistry.IContext<DocumentModel>
  ): H3cDocumentWidget {
    return new H3cDocumentWidget({
      context,
      content: new Haddock3ConfiguratorWidget(context)
    });
  }
}
