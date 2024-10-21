import Container from '../../Container';
import {
  ADMIN_ICON,
  ADMIN_PATH,
  ADMIN_TITLE,
  USER_ICON,
  USER_PATH,
  USER_TITLE,
} from '../../utils/constants';
import './Navbar.css';

const adminMenus = [
  {
    path: ADMIN_PATH.HOME,
    title: ADMIN_TITLE.HOME,
    icon: ADMIN_ICON.HOME,
  },
  {
    path: USER_PATH.MEMBER,
    title: ADMIN_TITLE.MEMBER,
    icon: ADMIN_ICON.MEMBER,
  },
  {
    path: ADMIN_PATH.VACATION,
    title: ADMIN_TITLE.VACATION,
    icon: ADMIN_ICON.VACATION,
  },
  {
    path: ADMIN_PATH.ANNOUNCEMENTS,
    title: ADMIN_TITLE.ANNOUNCEMENTS,
    icon: ADMIN_ICON.ANNOUNCEMENTS,
  },
  {
    path: ADMIN_PATH.STUDENT,
    title: ADMIN_TITLE.STUDENT,
    icon: ADMIN_ICON.STUDENT,
  },
];

const userMenus = [
  {
    path: USER_PATH.HOME,
    title: USER_TITLE.HOME,
    icon: USER_ICON.HOME,
  },
  { path: USER_PATH.MEMBER, title: USER_TITLE.MEMBER, icon: USER_ICON.MEMBER },
  {
    path: USER_PATH.WORKTIME,
    title: USER_TITLE.WORKTIME,
    icon: USER_ICON.WORKTIME,
  },
  {
    path: USER_PATH.VACATION,
    title: USER_TITLE.VACATION,
    icon: USER_ICON.VACATION,
  },
  {
    path: USER_PATH.ANNOUNCEMENTS,
    title: USER_TITLE.ANNOUNCEMENTS,
    icon: USER_ICON.ANNOUNCEMENTS,
  },
  {
    path: USER_PATH.STUDENT,
    title: USER_TITLE.STUDENT,
    icon: USER_ICON.STUDENT,
  },
  {
    path: USER_PATH.EDUCATION,
    title: USER_TITLE.EDUCATION,
    icon: USER_ICON.EDUCATION,
  },
];
export default class Navbar extends Container {
  constructor(getUser) {
    super('.navbar');
    this.getUser = getUser;
    this.userMenu = userMenus;
    this.adminMenu = adminMenus;
    this.path = window.location.pathname;
    this.render();
  }

  isActiveMenu(path) {
    // 현재 경로와 메뉴 path 비교
    return this.path === path;
  }

  render() {
    //admin
    if (this.getUser) {
      const menuItemsHTML = this.adminMenu
        .map(menu => {
          const isActive = this.isActiveMenu(menu.path); // 메뉴가 활성화된 상태인지 확인

          return `
          <ul class="menu">      
          <li class="menu-item">
            <a href="${menu.path}" class="${isActive ? 'active' : ''}">
                <span class="material-symbols-rounded">
                  ${menu.icon}
                </span>${menu.title}         
            </a>
          </li>         
        </ul>`;
        })
        .join('');
      this.$container.innerHTML = `
      <div class="menu-top">
        <div class="logo-circle"></div>      
        <h1>DOPAMING</h1>
      </div>
      <ul class="menu">
        ${menuItemsHTML}
      </ul>    
    `;
    } else {
      const menuItemsHTML = this.userMenu
        .map(menu => {
          const isActive = this.isActiveMenu(menu.path); // 메뉴가 활성화된 상태인지 확인
          return `
          <ul class="menu">      
          <li class="menu-item">
            <a href="${menu.path}" class="${isActive ? 'active' : ''}">
                <span class="material-symbols-rounded">
                ${menu.icon}
                </span>${menu.title}    
            </a>
          </li>         
        </ul>`;
        })
        .join('');
      this.$container.innerHTML = `
      <div class="menu-top">
        <div class="logo-circle"></div>      
        <h1>DOPAMING</h1>
      </div>
      <ul class="menu">
        ${menuItemsHTML}
      </ul>
    `;
    }
  }
}
