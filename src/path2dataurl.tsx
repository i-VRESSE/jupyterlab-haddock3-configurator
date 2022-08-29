import { ContentsManager } from '@jupyterlab/services';

export async function path2dataurl(path: string) {
  const contents = new ContentsManager();
  const file = await contents.get(path);
  if (file.type === 'file' && file.format === 'text') {
    const content64 = btoa(file.content);
    const dataUrl = `data:${file.mimetype};name=${path};base64,${content64}`;
    return dataUrl;
  }
  return path;
}
