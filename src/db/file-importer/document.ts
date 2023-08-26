import { Logger } from '@nestjs/common';

import { IDocument, INode, INodeParams } from './interfaces';
import { Node } from './node';
import * as config from './config';

export class Document implements IDocument {
  #structure: { [level: number]: INode[] } = {};
  #currentNode: INode | null = null;

  #logger = new Logger(Document.name);

  processRawFile(fileContent: string) {
    const lines = fileContent.split(config.EOL);
    if (!lines) throw new Error('The file is empty');

    const entitiesList: string[] = Object.values(config.ENTITIES);

    for (let i = 0; i <= lines.length; i += 1) {
      const line = lines[i];

      const value = line?.trim();
      if (!value) continue;

      const [indent] = line.match(/^\s*/);
      const level = indent.length / config.INDENT_LENGTH;
      // todo: !!! think, what if wrong indent count (just skip the row?)

      const isProp = line.includes(config.KEY_VALUE_DELIMITER);

      const isEntity =
        !isProp &&
        level !== (this.#currentNode?.level || 0) &&
        entitiesList.some((entity) => value === entity);

      const isList = !(isProp || isEntity);

      const node = Document.createNode({
        level,
        isList,
        isEntity,
        isProp,
        value,
      });
      this.#addNodeToLevel(node);
    }
  }

  getRootNodes(): INode[] {
    return this.#structure[0] || [];
  }

  #addNodeToLevel(node: INode) {
    if (!node || typeof node.level !== 'number')
      throw new Error('No node or level');
    const { level } = node;

    this.#defineRelations(node);

    if (!this.#structure[level]) {
      this.#structure[level] = [];
    }
    this.#structure[level].push(node);

    this.#currentNode = node;
  }

  #defineRelations(node: INode) {
    const current = this.#currentNode;

    if (node.level === 0) {
      this.#logger.log('adding root node');
    } else if (node.level > current?.level) {
      // assume, no indentation more the 1 indent (2 spaces)
      node.parent = current;
      current.addChild(node);
    } else if (node.level === current?.level) {
      const { parent } = current;
      node.parent = parent;
      parent.addChild(node);
    } else if (node.level < current?.level) {
      const parent = this.#getNodeFromLevel(node.level - 1);
      node.parent = parent;
      parent.addChild(node);
    } else {
      this.#logger.warn(`WEIRD NODE: ${node.value}`);
    }
  }

  #getNodeFromLevel(level: number) {
    const nodes = this.#structure[level];
    if (!nodes || !nodes.length)
      throw new Error(`No level ${level} OR it's empty`);
    return nodes[nodes.length - 1];
  }

  static createNode(params: INodeParams) {
    return new Node(params);
  }
}
