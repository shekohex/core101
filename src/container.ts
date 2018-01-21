import 'reflect-metadata';
import { AppModule, Controller, InstanceWrapper } from './interfaces';
import { Provider, ReflectiveInjector } from './di';

export class AppContainer {
  private readonly modules = new Map<AppModule, ModuleDependencies>();

  addModule(module) {
    if (!this.modules.has(module)) {
      this.modules.set(module, {
        instance: new module(),
        imports: new Set<Provider>(),
        providers: new Map<Provider, InstanceWrapper<Provider>>(),
        controllers: new Map<Controller & Provider, InstanceWrapper<Controller & Provider>>(),
        injector: undefined,
        externalInjector: undefined
      });
    }
  }

  addImports(imported: any, module: AppModule) {
    if (this.modules.has(module)) {
      const storedModule = this.modules.get(module);
      storedModule.imports.add(imported);
    }
  }
  addProviders(provider: Provider, module: AppModule) {
    if (this.modules.has(module)) {
      const storedModule = this.modules.get(module);
      storedModule.providers.set(provider, { instance: null });
    }
  }
  addControllers(controller: Controller & Provider, module: AppModule) {
    if (this.modules.has(module)) {
      const storedModule = this.modules.get(module);
      storedModule.controllers.set(controller, { instance: null });
    }
  }
  getModule(module: AppModule): ModuleDependencies {
    return this.modules.get(module);
  }

  getImports(module: AppModule): Set<Provider> {
    return this.getModule(module).imports;
  }
  getProviders(module: AppModule): Map<Provider, InstanceWrapper<Provider>> {
    return this.getModule(module).providers;
  }

  getModules(): Map<AppModule, ModuleDependencies> {
    return this.modules;
  }
}

export interface ModuleDependencies extends InstanceWrapper<AppModule> {
  imports?: Set<Provider>;
  providers?: Map<Provider, InstanceWrapper<Provider>>;
  controllers?: Map<Controller & Provider, InstanceWrapper<Controller & Provider>>;
  injector: ReflectiveInjector;
  externalInjector: ReflectiveInjector;
}
