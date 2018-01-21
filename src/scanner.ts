import 'reflect-metadata';
import { AppModule } from './interfaces';
import { AppContainer, ModuleDependencies } from './container';
import { Provider } from './di';

export class DependenciesScanner {
  constructor(private container: AppContainer) {}

  scan(module: AppModule) {
    this.scanForModules(module);
    this.scanModulesForDependencies();
  }
  private scanForModules(module: AppModule) {
    this.storeModule(module);

    const importedModules = Reflect.getMetadata('imports', module) || [];
    importedModules.map(module => this.scanForModules(module));
  }

  private storeModule(module: AppModule) {
    this.container.addModule(module);
  }
  private scanModulesForDependencies() {
    const modules = this.container.getModules();
    modules.forEach((deps, module) => {
      const imports = Reflect.getMetadata('imports', module) || [];
      imports.map(imported => this.container.addImports(imported, module));

      const providers = Reflect.getMetadata('providers', module) || [];
      providers.map(provider => this.container.addProviders(provider, module));

      const controllers = Reflect.getMetadata('controllers', module) || [];
      controllers.map(controller => this.container.addControllers(controller, module));
    });
  }
}
