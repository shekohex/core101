import 'reflect-metadata';
import { ReflectiveInjector, Provider } from './di';
import { AppContainer, ModuleDependencies } from './container';
import { AppModule } from './interfaces';

export class CoreInjector {
  private rootInjector: ReflectiveInjector;
  constructor(private container: AppContainer) {}
  createInstancesOfDependencies() {
    const modules = this.container.getModules();
    this.createProviders(modules.keys().next().value);
  }

  private createInjector(
    providers: Provider[],
    parent: ReflectiveInjector = null
  ): ReflectiveInjector {
    const resolvedProviders = ReflectiveInjector.resolve(providers);
    if (parent !== null && parent !== undefined) {
      return parent.createChildFromResolved(resolvedProviders) as ReflectiveInjector;
    } else {
      return ReflectiveInjector.fromResolvedProviders(resolvedProviders) as ReflectiveInjector;
    }
  }

  private createProviders(module: AppModule, isChild: boolean = false) {
    const _module = this.container.getModule(module);
    if (!isChild) {
      _module.injector = this.createInjector([
        ..._module.providers.keys(),
        ..._module.controllers.keys()
      ]);
      this.rootInjector = _module.injector;
    } else if (_module.imports.size > 0 && isChild) {
      const parentInjector = this.container.getModule(_module.imports.keys().next().value).injector;
      _module.injector = this.createInjector(
        [..._module.providers.keys(), ..._module.controllers.keys(), ..._module.imports.keys()],
        parentInjector
      );
    } else {
      _module.injector = this.createInjector(
        [..._module.providers.keys(), ..._module.controllers.keys(), ..._module.imports.keys()],
        this.rootInjector
      );
    }
    this.createInstancesOfProviders(_module);
    this.createInstancesOfControllers(_module);
    const innerModules = this.container.getImports(module) || new Set<Provider>();
    innerModules.forEach(module => this.createProviders(module, true));
  }

  private createInstancesOfProviders(module: ModuleDependencies, injector?: ReflectiveInjector) {
    module.providers.forEach((provider, type) => {
      provider.instance = module.injector.get(type);
    });
  }

  private createInstancesOfControllers(module: ModuleDependencies, injector?: ReflectiveInjector) {
    module.controllers.forEach((controller, type) => {
      controller.instance = module.injector.get(type);
    });
  }
}
