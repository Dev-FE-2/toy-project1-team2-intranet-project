import Layout from './components/layouts/Layout';
class App {
  constructor() {
    this.layout = new Layout();
    // this.route = new Route();

    this.render();
  }

  // getUserRole() {
  //   return getItem('admin') || '';
  // }

  render() {
    this.layout.render();
    // this.route.init();
  }
}

document.addEventListener('DOMContentLoaded', new App());
