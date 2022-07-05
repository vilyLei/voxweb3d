
import { SubThreadModule } from "./SubThreadModule";

interface IThreadCore {
  getCurrTaskClass(): number;
  setCurrTaskClass( taskClass: number ): void;
  resetCurrTaskClass(): void;
  registerDependency( dependencyNSList: string[] ): void;
  useDependency(moduleInstance: SubThreadModule): void;
  initializeExternModule(moduleInstance: SubThreadModule): void;
  acquireData(moduleInstance: SubThreadModule, pdata: unknown, taskCmd: string): void;
  transmitData(moduleInstance: SubThreadModule, pdata: unknown, ptaskCmd: string, transfers: ArrayBuffer[]): void;
  postMessageToThread(obj: unknown, transfers?: ArrayBuffer[]): void;
}

export { IThreadCore };
