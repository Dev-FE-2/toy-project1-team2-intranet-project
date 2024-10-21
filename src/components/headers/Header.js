import { USER_PATH } from '../../utils/constants';
import './Header.css';

export default class Header {
  constructor(getUser) {
    const HEADER_ELEMENT = document.querySelector('.header');
    this.$header = HEADER_ELEMENT;
    this.getUser = getUser;
    this.render();
  }

  render() {
    if (this.getUser) {
      this.$header.innerHTML = `
      <div class="header-wapper">
        <div class="header-items">
          <span class="user-name">김아무</span>
          <button class="logout">로그아웃</button>
        </div>
        <div class="circle"></div>      
      </div>
      `;
    } else {
      this.$header.innerHTML = `
      <div class="header-wapper">
        <div class="header-items">
          <span class="user-name">김아무</span>
          <button class="logout">로그아웃</button>
        </div>        
        <div class="circle"><a href="${USER_PATH}"></a></div>      
      </div>
      `;
    }
  }
}
