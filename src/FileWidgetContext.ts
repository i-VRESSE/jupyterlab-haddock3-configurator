import React from 'react';

import { IDocumentManager } from '@jupyterlab/docmanager';

interface IProps {
  manager: IDocumentManager;
  baseUrl: string;
}

export const FileWidgetContext = React.createContext<IProps | undefined>(
  undefined
);
