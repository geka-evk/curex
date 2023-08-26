import { Logger } from '@nestjs/common';
import { INode, INodeParams } from './interfaces';

export class Node implements INode {
  #parent: INode | null = null;
  #children: INode[] = [];

  level: number;
  value: string;
  isList: boolean;
  isEntity: boolean;
  isProp: boolean;

  logger = new Logger(Node.name);

  constructor(params: INodeParams) {
    Object.assign(this, params);
  }

  get parent() {
    return this.#parent;
  }

  set parent(node) {
    if (this.level === node.level + 1) {
      this.#parent = node;
    } else {
      this.logger.debug(`this.level: ${this.level};  node.level:${node.level}`);
      throw new Error('Invalid parent level');
    }
  }

  get children() {
    return this.#children;
  }

  addChild(child: INode): void {
    this.#children.push(child);
  }
}
