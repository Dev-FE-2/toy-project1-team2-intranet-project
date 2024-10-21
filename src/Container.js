export default class Container {
  constructor(element) {
    this.$container = document.querySelector(element);
    if (!this.$container) {
      console.error(`Container element ${element} not found`);
    }
  }
}
