import './style.css';
import Router from './routes/Router';
import Layout from './components/layouts/Layout';
import { getItem } from './utils/storage';

class App {
  constructor() {
    this.layout = new Layout();
    this.router = new Router(this.layout);
    this.isAdmin = getItem('admin');
  }

  init() {
    this.layout.render();
    this.router.init(this.isAdmin);
    document.addEventListener('click', this.handleNavigation.bind(this));
  }

  handleNavigation(event) {
    const anchor = event.target.closest('a');
    if (anchor && anchor.href) {
      event.preventDefault();
      this.router.navigate(anchor.href);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
