import { VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { expect } from 'chai';
import * as path from 'path';
import { ApplicationOptions } from '../../src/application/schema';
import { ServiceOptions } from '../../src/service/schema';

describe('Service Factory', () => {
  const options: ServiceOptions = {
    name: 'name',
  };
  let tree: UnitTestTree;
  before(() => {
    const runner: SchematicTestRunner = new SchematicTestRunner(
      '.',
      path.join(process.cwd(), 'src/collection.json')
    );
    const appOptions: ApplicationOptions = {
      directory: '',
    };
    const appTree: UnitTestTree = runner.runSchematic('application', appOptions, new VirtualTree());
    tree = runner.runSchematic('service', options, appTree);
  });
  it('should generate a new service file', () => {
    const files: string[] = tree.files;
    expect(
      files.find(
        (filename) => filename === `/src/${options.name}/${ options.name }.service.ts`
      )
    ).to.not.be.undefined;
  });
  it('should generate the expected service file content', () => {
    expect(
      tree.readContent(`/src/${options.name}/${ options.name }.service.ts`)
    ).to.be.equal(
      'import { Component } from \'@nestjs/common\';\n' +
      '\n' +
      '@Component()\n' +
      'export class NameService {}\n'
    );
  });
  it('should import the new service in the application module', () => {
    expect(
      tree.readContent(path.join(
        '/src',
        'app.module.ts'
      ))
    ).to.be.equal(
      'import { Module } from \'@nestjs/common\';\n' +
      'import { AppController } from \'./app.controller\';\n' +
      'import { NameService } from \'./name/name.service\';\n' +
      '\n' +
      '@Module({\n' +
      '  imports: [],\n' +
      '  controllers: [\n' +
      '    AppController\n' +
      '  ],\n' +
      '  components: [\n' +
      '    NameService\n' +
      '  ]\n' +
      '})\n' +
      'export class ApplicationModule {}\n'
    );
  });
});
