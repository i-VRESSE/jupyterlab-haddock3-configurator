import { ContentsManager } from '@jupyterlab/services';
import { Contents as ServerContents } from '@jupyterlab/services';

export async function path2dataurl(
  path: string,
  base: string
): Promise<string> {
  const contents = new ContentsManager();
  try {
    const file = await contents.get(path);
    return model2dataurl(path, file);
  } catch (error) {
    // Try again using fetch
    try {
      const url = base + 'files/' + path;
      const response = await fetch(url);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const blob = await response.blob();
      const dataUrl = await processBlob(blob);
      return addNameToDataURL(dataUrl, path);
    } catch (error) {
      // Try IndexedDB for Jupyterlite virtual files
      const database = await openIndexedDb('JupyterLite Storage');
      const file = await fileFromIndexedDb(database, path);
      return model2dataurl(path, file);
    }
  }
}

function model2dataurl(path: string, file: ServerContents.IModel) {
  if (file.type === 'file' && file.format === 'text') {
    const content64 = btoa(file.content);
    const dataUrl = `data:${file.mimetype};name=${path};base64,${content64}`;
    return dataUrl;
  }
  // TODO handle other formats and types
  return path;
}

function openIndexedDb(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name);
    request.onerror = () => reject();
    request.onsuccess = () => resolve(request.result);
  });
}

function fileFromIndexedDb(
  db: IDBDatabase,
  key: string,
  table = 'files'
): Promise<ServerContents.IModel> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([table], 'readonly');
    const objectStore = transaction.objectStore(table);
    const req = objectStore.get(key);
    req.onerror = () => reject();
    req.onsuccess = () => resolve(req.result as ServerContents.IModel);
  });
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

function addNameToDataURL(dataURL: string, name: string) {
  return dataURL.replace(';base64', `;name=${name};base64`);
}
