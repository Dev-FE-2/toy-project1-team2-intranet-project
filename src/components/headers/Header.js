import { USER_PATH } from '../../utils/constants';
import './Header.css';
import Container from '../../Container';
export default class Header extends Container {
  constructor(getUser) {
    super('.header-container');
    this.getUser = getUser;
    // this.render();
  }

  render() {
    if (this.getUser) {
      this.$container.innerHTML = `
      <div class="header-wapper">
        <div class="header-items">
          <span class="user-name">김아무</span>
          <button class="logout">로그아웃</button>
        </div>
        <div class="circle"></div>      
      </div>
      `;
    } else {
      this.$container.innerHTML = `
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
