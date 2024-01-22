export class DataShare {
  private value: any;
  private callbacks: any;
  private notify: boolean;
  constructor() {
    console.log("new Data share object");
    this.callbacks = [];
    this.notify = true;
  }

  setValue(newValue: any) {
    this.value = newValue;
    if (this.notify) this.notifyCallbacks();
  }

  pauseNotification() {
    this.notify = false;
  }
  resumeNotification() {
    this.notify = true;
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
