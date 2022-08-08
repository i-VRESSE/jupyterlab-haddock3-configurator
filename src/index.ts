import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { Haddock3ConfiguratorWidget } from './widget';

/**
 * Initialization data for the haddock3-configurator extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'haddock3-configurator:plugin',
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    settingRegistry: ISettingRegistry | null
  ) => {
    console.log('JupyterLab extension haddock3-configurator is activated!');
    console.log('ICommandPalette:', palette);

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
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

    const content = new Haddock3ConfiguratorWidget();
    const widget = new MainAreaWidget({ content });
    widget.id = 'h3c-jupyterlab';
    widget.title.label = 'Haddock3 config';
    widget.title.closable = true;

    const command = 'h3c:create-new';
    app.commands.addCommand(command, {
      label: 'Create haddock3 config',
      execute: () => {
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'main');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    palette.addItem({ command, category: 'Haddock3' });
  }
};

export default plugin;
