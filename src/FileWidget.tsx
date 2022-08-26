import React, { useContext, useEffect, useState } from 'react';
import { WidgetProps, Widget, utils } from '@rjsf/core';
import { FileDialog } from '@jupyterlab/filebrowser';
import { FileWidgetContext } from './FileWidgetContext';
import { Contents } from '@jupyterlab/services';
import { dataURL2filename } from '@i-vresse/wb-core/dist/dataurls';
import { ContentsManager } from '@jupyterlab/services';

export const FileWidget: Widget = props => {
  const [name, setName] = useState(props.value as string);
  const context = useContext(FileWidgetContext);
  const { uiSchema } = props;

  async function handleClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();

    if (context === undefined) {
      return;
    }
    const { manager } = context;

    const filter = dialogFilter(uiSchema);
    const { value: files } = await FileDialog.getOpenFiles({ manager, filter });
    if (files === null || files.length !== 1) {
      return;
    }
    const file = files[0];
    const dataUrl = await path2dataurl(file.path);
    props.onChange(dataUrl);
  }

  useEffect(() => {
    if (props.value === undefined) {
      setName('');
    } else {
      if (props.value.startsWith('data:')) {
        const newName = dataURL2filename(props.value);
        setName(newName);
      } else {
        setName(props.value);
      }
    }
  }, [props.value]);

  return (
    <div>
      <button
        type="button"
        className="btn btn-light"
        onClick={e => handleClick(e)}
      >
        Choose file
      </button>
      {name}
    </div>
  );
};
async function path2dataurl(path: string) {
  const contents = new ContentsManager();
  const file = await contents.get(path);
  if (file.type === 'file' && file.format === 'text') {
    const content64 = btoa(file.content);
    const dataUrl = `data:${file.mimetype};name=${path};base64,${content64}`;
    return dataUrl;
  }
  return path;
}

function dialogFilter(uiSchema: WidgetProps['uiSchema']) {
  const uiOptions = utils.getUiOptions(uiSchema);
  let filter: (value: Contents.IModel) => boolean = () => true;
  if (
    uiOptions &&
    'accept' in uiOptions &&
    typeof uiOptions.accept === 'string'
  ) {
    const accepts = uiOptions.accept.split(',').map(a => {
      const isExtension = a.startsWith('.');
      if (isExtension) {
        return (v: Contents.IModel) => v.path.endsWith(a);
      }
      return (v: Contents.IModel) => v.mimetype === a;
    });
    filter = value => accepts.some(a => a(value));
  }
  return filter;
}
