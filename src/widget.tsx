import * as React from 'react';

import { ReactWidget } from '@jupyterlab/apputils';
import { Wrapper } from '@i-vresse/wb-core';
import App from './App';

export class Haddock3ConfiguratorWidget extends ReactWidget {
  render(): JSX.Element {
    return (
      <Wrapper>
        <App />
      </Wrapper>
    );
  }
}
