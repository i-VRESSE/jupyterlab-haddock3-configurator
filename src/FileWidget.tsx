import React, { useContext } from 'react';
import { WidgetProps } from '@rjsf/core';
import { FileDialog } from '@jupyterlab/filebrowser';
import { DocManagerContext } from './DocManagerContext';

export const FileWidget: React.FC<WidgetProps> = props => {
  const manager = useContext(DocManagerContext);

  async function handleClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();

    if (manager === undefined) {
      return;
    }
    const { value: files } = await FileDialog.getOpenFiles({ manager });
    if (files === null || files.length !== 1) {
      return;
    }
    const file = files[0];
    props.onChange(file.path);
  }

  return (
    <div>
      <button className="btn" onClick={e => handleClick(e)}>
        Choose file
      </button>
      {props.value}
    </div>
  );
};
