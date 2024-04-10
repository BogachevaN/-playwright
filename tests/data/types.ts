export interface StrategySaltInterface {
  execute(): string;
}

export interface DataProviderInterface<T extends Record<string, any>=Record<string, any>> {
  init(data?: T): T;
  export(): T;
  setField(name: keyof T, value?: string): void;
  getField(name: keyof T): string;
  clear(): void;
}
export interface DataManagerInterface {
  createProvider<T extends Record<string, any>>(domain: string, force?: boolean, strategy?: StrategySaltInterface) : DataProviderInterface<T>;
}


