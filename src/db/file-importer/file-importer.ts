import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { IFileImporter, IDocument, INode } from './interfaces';
import { TJsonContent } from './types';
import { documentFactory } from './document-factory';
import { INPUT_DIRECTORY, INPUT_FILE, KEY_VALUE_DELIMITER } from './config';

@Injectable()
export class FileImporter implements IFileImporter {
  #structure: TJsonContent = {};
  #doc: IDocument;

  #logger = new Logger(FileImporter.name);

  makeJsonFromText(content: string): TJsonContent | null {
    try {
      this.#doc = documentFactory();
      this.#doc.processRawFile(content);
      const json = this.#assemble();
      this.#logger.log('json structure is ready to be stored in DB');
      return json;
    } catch (err) {
      this.#logger.error(`error in makeJsonFromFile: ${err.message}`);
      return null;
    }
  }

  async importFromFile(
    fileName: string = INPUT_FILE,
  ): Promise<TJsonContent | null> {
    try {
      const content: string = await this.#readFileContent(fileName);
      return this.makeJsonFromText(content);
    } catch (err) {
      this.#logger.error(`error on file loading: ${err.message}`);
      if (err.code === 'ENOENT')
        throw new BadRequestException(`No file ${fileName}`);
      return null;
    }
  }

  #assemble(): TJsonContent {
    this.#doc
      .getRootNodes()
      .forEach((node: INode) => this.#assembleRoot(node, this.#structure));
    this.#logger.debug('JSON assembling is done');

    return this.#structure;
  }

  #assembleRoot(node: INode, parent: object | Array<object>) {
    let current: object | [];

    if (node.isProp) {
      const [key, value] = node.value
        .split(KEY_VALUE_DELIMITER)
        .map((_) => _.trim());
      parent[key] = value;
    } else if (node.isEntity) {
      if (!Array.isArray(parent))
        throw new Error('Parent for entity should be an array');
      current = {};
      parent.push(current);
    } else {
      current = [];
      parent[node.value] = current;
    }

    if (node.children.length && current) {
      return node.children.map((n: INode) => this.#assembleRoot(n, current));
      // todo: add checks to prevent huge levels of nesting
    }

    return parent;
  }

  // todo: move this responsibility to Document
  #readFileContent(fileName: string) {
    const filePath = path.resolve(INPUT_DIRECTORY, fileName);
    return readFile(filePath, 'utf-8');
  }
}
