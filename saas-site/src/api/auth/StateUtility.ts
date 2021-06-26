import StateStorage from "./StateStorage";

abstract class StateUtility<T> {
  public readonly state: T;
  protected readonly storage: StateStorage;

  public abstract serialize(): string;
  public abstract deserialize(x: string): T;
  public abstract newDefaultState(): T;

  constructor(newState?: T) {
    this.state = newState ? newState : this.newDefaultState();
    this.storage = new StateStorage("myKey");
  }

  public save(): void {
    this.storage.save(this.serialize());
  }

  public load(): T {
    const loadedState = this.storage.load();
    if (loadedState) {
      return this.deserialize(loadedState);
    } else {
      return this.newDefaultState();
    }
  }

  public clear(): void {
    this.storage.clear();
  }
}

export default StateUtility;
