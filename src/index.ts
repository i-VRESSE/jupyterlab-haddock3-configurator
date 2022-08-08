import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the haddock3-configurator extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'haddock3-configurator:plugin',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension haddock3-configurator is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('haddock3-configurator settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for haddock3-configurator.', reason);
        });
    }
  }
};

export default plugin;
