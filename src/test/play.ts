import { AppContainer } from '../container';
import { CoreInjector } from '../injector';
import { DependenciesScanner } from '../scanner';
import { Module } from '../decorators';
import { Injectable } from '../di';

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
@Module({ controllers: [Car], exports: [Car] })
class TestModule1 {}

@Module({ imports: [TestModule1], controllers: [Train] })
class TestModule2 {}

@Module({
  imports: [TestModule1, TestModule2],
  providers: [TerboEngine, Engine],
  exports: [TerboEngine, Engine, TestModule1]
})
class RootModule {}

const container = new AppContainer();
const dependenciesScanner = new DependenciesScanner(container);
const injector: CoreInjector = new CoreInjector(container);
dependenciesScanner.scan(RootModule);
injector.createInstancesOfDependencies();
