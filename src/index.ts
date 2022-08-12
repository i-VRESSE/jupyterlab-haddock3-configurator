import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ILauncher } from '@jupyterlab/launcher';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';
import { H3cDocumentWidget } from './widget';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { H3cFactory } from './factory';

const pluginId = 'haddock3-configurator:plugin';

const FACTORY = 'Haddock3 configurator factory';

const activate = (
  app: JupyterFrontEnd,
  browserFactory: IFileBrowserFactory,
  palette: ICommandPalette,
  restorer: ILayoutRestorer,
  settingRegistry: ISettingRegistry | null,
  launcher: ILauncher | null
): void => {
  // Track and restore the widget state
  const tracker = new WidgetTracker<H3cDocumentWidget>({
    namespace: 'h3c'
  });

  if (restorer) {
    restorer.restore(tracker, {
      command: 'docmanager:open',
      args: widget => ({ path: widget.context.path, factory: FACTORY }),
      name: widget => widget.context.path
    });
  }

  const factory = new H3cFactory({
    name: FACTORY,
    fileTypes: ['haddock3-config'],
    defaultFor: ['haddock3-config']
  });
  factory.setManager(browserFactory.defaultBrowser.model.manager);

  factory.widgetCreated.connect((sender, widget) => {
    widget.title.iconClass = 'jp-MaterialIcon jp-ListIcon';

    // Notify instance tracker if restore data needs to be updated
    widget.context.pathChanged.connect(() => {
      tracker.save(widget);
    });
    tracker.add(widget);
  });

  app.docRegistry.addWidgetFactory(factory);

  app.docRegistry.addFileType({
    name: 'haddock3-config',
    displayName: 'Haddock3 config',
    mimeTypes: ['text/plain'],
    pattern: '.cfg$',
    extensions: ['.cfg'],
    iconClass: 'jp-MaterialIcon jp-ListIcon',
    fileFormat: 'text',
    contentType: 'file'
  });

  if (settingRegistry) {
    settingRegistry
      .load(pluginId)
      .then(settings => {
        console.log(
          'haddock3-configurator settings loaded:',
          settings.composite
        );
      })
      .catch(reason => {
        console.error(
          'Failed to load settings for haddock3-configurator.',
          reason
        );
      });
  }

  const command = 'h3c:create-new';
  app.commands.addCommand(command, {
    label: 'Haddock3 config',
    iconClass: 'jp-MaterialIcon jp-ListIcon',
    caption: 'Create a new config file',
    execute: () => {
      const cwd = browserFactory.defaultBrowser.model.path;
      app.commands
        .execute('docmanager:new-untitled', {
          path: cwd,
          type: 'file',
          ext: '.cfg'
        })
        .then(model =>
          app.commands.execute('docmanager:open', {
            path: model.path,
            factory: FACTORY
          })
        );
    }
  });

  palette.addItem({ command, category: 'Haddock3' });

  // Add a launcher item if the launcher is available.
  if (launcher) {
    launcher.add({
      command: 'h3c:create-new',
      rank: 1,
      category: 'Other'
    });
  }
};

/**
 * Initialization data for the haddock3-configurator extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: pluginId,
  autoStart: true,
  optional: [ISettingRegistry, ILauncher],
  requires: [IFileBrowserFactory, ICommandPalette, ILayoutRestorer],
  activate
};

export default plugin;
