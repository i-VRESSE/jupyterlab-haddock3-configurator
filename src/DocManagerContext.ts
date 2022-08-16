import React from 'react';

import { IDocumentManager } from '@jupyterlab/docmanager';

export const DocManagerContext = React.createContext<
  IDocumentManager | undefined
>(undefined);
