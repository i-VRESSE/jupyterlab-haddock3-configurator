import React, { useContext, useEffect, useState } from 'react';
import { WidgetProps, Widget, utils } from '@rjsf/core';
import { FileDialog } from '@jupyterlab/filebrowser';
import { DocManagerContext } from './DocManagerContext';
import { Contents } from '@jupyterlab/services';
import { dataURL2filename } from '@i-vresse/wb-core/dist/dataurls';

function addNameToDataURL(dataURL: string, name: string) {
  return dataURL.replace(';base64', `;name=${encodeURIComponent(name)};base64`);
}

function processBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = event => {
      if (
        event.target === null ||
        event.target.result === null ||
        event.target.result instanceof ArrayBuffer
      ) {
        return reject(event.target);
      }
      resolve(event.target.result);
    };
    reader.readAsDataURL(blob);
  });
}

export const FileWidget: Widget = props => {
  const [name, setName] = useState(props.value as string);
  const manager = useContext(DocManagerContext);
  const { uiSchema } = props;

  async function handleClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();

    if (manager === undefined) {
      return;
    }

    const filter = dialogFilter(uiSchema);
    const { value: files } = await FileDialog.getOpenFiles({ manager, filter });
    if (files === null || files.length !== 1) {
      return;
    }
    const file = files[0];
    const dataUrl = await file2dataurl(file.path);
    props.onChange(dataUrl);
  }

  useEffect(() => {
    if (props.value === undefined) {
      setName('');
    } else {
      const newName = dataURL2filename(props.value);
      setName(newName);
    }
  }, [props.value]);

  return (
    <div>
      <button className="btn btn-light" onClick={e => handleClick(e)}>
        Choose file
      </button>
      {name}
    </div>
  );
};
async function file2dataurl(path: string) {
  // TODO current url expects Jupyter Lab to run at /, should be more generic
  const url = '/files/' + path;
  const resp = await fetch(url);
  const blob = await resp.blob();
  const dataUrl = await processBlob(blob);
  const namedDataUrl = addNameToDataURL(dataUrl, path);
  return namedDataUrl;
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
