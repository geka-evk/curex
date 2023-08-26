import { TJsonContent } from './types';

export interface INodeParams {
  level: number;
  value: string;
  isList: boolean;
  isEntity: boolean;
  isProp: boolean;
}

export interface INode extends INodeParams {
  parent: INode | null;
  children: INode[];
  addChild: (child: INode) => void;
}

export interface IDocument {
  processRawFile: (content: string) => void;
  getRootNodes: () => INode[];
}

export interface IFileImporter {
  importFromFile: (fileName?: string) => Promise<TJsonContent | null>;
}
