import { expect } from 'chai';
import { AppContainer } from '../container';
import { CoreInjector } from '../injector';
import { DependenciesScanner } from '../scanner';
import { Module } from '../decorators';
import { Injectable } from '../di';

describe('Modules', () => {
  let injector: CoreInjector;
  class Engine {}
  @Injectable()
  class TerboEngine {
    constructor(private engine: Engine) {}
  }

  @Injectable()
  class Car {
    constructor(private terboEngine: TerboEngine) {}
  }

  @Injectable()
  class Train {
    constructor(private terboEngine: TerboEngine, private car: Car) {}
  }

  @Injectable()
  class Rocket {
    constructor(private terboEngine: TerboEngine) {}
  }
  @Module({ providers: [Car] })
  class TestModule1 {}

  @Module({ imports: [TerboEngine], controllers: [Train] })
  class TestModule2 {}

  @Module({ imports: [TestModule1], controllers: [Rocket] })
  class TestModule3 {}

  @Module({ imports: [TestModule1, TestModule3], providers: [TerboEngine, Engine] })
  class RootModule {}

  beforeEach(() => {
    const container = new AppContainer();
    const dependenciesScanner = new DependenciesScanner(container);
    injector = new CoreInjector(container);
    dependenciesScanner.scan(RootModule);
  });

  it('should resolve Dependencies', () => {
    injector.createInstancesOfDependencies();
  });
});
