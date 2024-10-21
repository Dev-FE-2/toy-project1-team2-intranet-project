import MembersPage from '../pages/membes/Member';
import HomePage from '../pages/home/Home.js';
import NotFound from '../pages/notfound/NotFound.js';

export default class Route {
  constructor() {
    this.routes = {
      '/': { title: 'Home', page: new HomePage() },
      '/members': { title: 'Members', page: new MembersPage() },
    };
    this.currentPage = null;
    this.notFoundPage = new NotFound();
    this.init(); // 초기화
  }

  init() {
    window.addEventListener('popstate', () => this.route());
    this.handleInitialPageLoad();
    document
      .querySelector('nav')
      .addEventListener('click', this.handleLinkClick.bind(this));
  }

  handleInitialPageLoad() {
    const path = window.location.pathname;
    this.navigate(path);
  }

  handleLinkClick(event) {
    const anchor = event.target.closest('a');
    if (anchor && anchor.href) {
      event.preventDefault();
      const path = new URL(anchor.href).pathname;
      this.navigate(path);
    }
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.route();
  }

  route() {
    const path = window.location.pathname;
    const matchedRoute = this.routes[path];

    if (this.currentPage && this.currentPage.cleanUp) {
      this.currentPage.cleanUp();
    }

    if (matchedRoute) {
      this.currentPage = matchedRoute.page;
      document.title = matchedRoute.title;
      this.currentPage.render();
    } else {
      this.notFoundPage.render();
    }

    // Active 클래스 처리
    this.setActiveClass(path);
  }

  setActiveClass(path) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === path);
    });
  }
}
