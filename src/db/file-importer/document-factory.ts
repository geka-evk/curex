import { IDocument } from './interfaces';
import { Document } from './document';

export const documentFactory = (): IDocument => {
  // todo: define separate doc classes for any new file formats
  return new Document();
};
