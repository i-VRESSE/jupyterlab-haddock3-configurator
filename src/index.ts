import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';
import { Haddock3ConfiguratorWidget } from './widget';

const pluginId = 'haddock3-configurator:plugin';

const activate = (
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer,
  settingRegistry: ISettingRegistry | null
): void => {
  console.log('JupyterLab extension haddock3-configurator is activated!');
  console.log('ICommandPalette:', palette);

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

  let widget: MainAreaWidget<Haddock3ConfiguratorWidget>;

  const command = 'h3c:create-new';
  app.commands.addCommand(command, {
    label: 'Create haddock3 config',
    execute: () => {
      if (!widget || widget.isDisposed) {
        const content = new Haddock3ConfiguratorWidget();
        widget = new MainAreaWidget({ content });
        widget.id = 'h3c-jupyterlab';
        widget.title.label = 'Haddock3 config';
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
      widget.content.update();

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  palette.addItem({ command, category: 'Haddock3' });

  // Track and restore the widget state
  const tracker = new WidgetTracker<MainAreaWidget<Haddock3ConfiguratorWidget>>(
    {
      namespace: 'h3c'
    }
  );
  restorer.restore(tracker, {
    command,
    name: () => 'h3c'
  });
};

/**
 * Initialization data for the haddock3-configurator extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: pluginId,
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ICommandPalette, ILayoutRestorer],
  activate
};

export default plugin;
