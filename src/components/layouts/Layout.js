import Header from '../headers/Header';
import Navbar from '../nav-bars/Navbar';

export default class Layout {
  constructor() {
    this.header = new Header();
    this.navBar = new Navbar();
    this.contentContainer = document.getElementById('content');
  }

  render() {
    this.header.render(); // 헤더 렌더링
    this.navBar.render(); // 네비게이션 바 렌더링
    this.updateActiveNavLink(window.location.pathname);
  }

  setContent(component) {
    this.contentContainer.innerHTML = '';
    component.render(this.contentContainer);
  }

  updateActiveNavLink(path) {
    this.navBar.updateActiveLink(path);
  }
}
