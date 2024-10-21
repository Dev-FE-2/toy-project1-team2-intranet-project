import Header from '../headers/Header';
import NavBar from '../navbars/Navbar';
import Container from '../../Container';
export default class Layout extends Container {
  constructor() {
    super('#root');

    // this.getUser = getUserRole;
  }

  renderHeader() {
    this.Header = new Header();
    this.Header.render();
  }

  renderNavbar() {
    this.NavBar = new NavBar();
    this.NavBar.render();
  }
  render() {
    this.$container.innerHTML = `
      <header class="header-container desktop-only"></header>
      <nav class="navbar"></nav>
      <main class="content"></main>
    `;
    this.renderHeader();
    this.renderNavbar();
  }
  setContent(page) {
    // page.render() 메서드를 호출하여 .content 내부에 페이지 컨텐츠를 삽입
    const contentContainer = this.$container.querySelector('.content');
    contentContainer.innerHTML = ''; // 기존 내용을 제거
    contentContainer.appendChild(page.render()); // 새로운 페이지의 내용을 추가
  }
}
