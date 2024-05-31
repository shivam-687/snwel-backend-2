class GlobalState {
    private static instance: GlobalState;
    private state: Record<string, any>;
  
    private constructor() {
      this.state = {}; // Initialize an empty state object
    }
  
    public static getInstance(): GlobalState {
      if (!GlobalState.instance) {
        GlobalState.instance = new GlobalState();
      }
      return GlobalState.instance;
    }
  
    public setState(key: string, value: any): void {
      this.state[key] = value;
    }
  
    public getState(key: string): any {
      return this.state[key];
    }
  
    public getAllState(): Record<string, any> {
      return this.state;
    }
  }
  
  export default GlobalState.getInstance(); // Export an instance of GlobalState
  