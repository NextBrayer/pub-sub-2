export class DataShare {
  private value: any;
  private callbacks: any;
  constructor() {
    console.log("new Data share object");
    this.callbacks = [];
  }

  setValue(newValue: any) {
    this.value = newValue;
    this.notifyCallbacks();
  }

  registerCallback(callback: any) {
    this.callbacks.push(callback);
  }

  notifyCallbacks() {
    this.callbacks.forEach((callback: any) => {
      callback(this.value);
    });
  }
}


