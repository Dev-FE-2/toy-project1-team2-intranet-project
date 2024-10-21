import {
  ADMIN_PATH,
  ADMIN_TITLE,
  ADMIN_ICON,
  USER_PATH,
  USER_TITLE,
  USER_ICON,
} from '../../utils/constants';
import './Navbar.css';

export default class Navbar {
  constructor() {
    this.element = document.querySelector('.navbar');
    this.adminMenuItems = [
      { path: ADMIN_PATH.HOME, title: ADMIN_TITLE.HOME, icon: ADMIN_ICON.HOME },
      {
        path: ADMIN_PATH.MEMBER,
        title: ADMIN_TITLE.MEMBER,
        icon: ADMIN_ICON.MEMBER,
      },
      {
        path: ADMIN_PATH.VACATION,
        title: ADMIN_TITLE.VACATION,
        icon: ADMIN_ICON.VACATION,
      },
      {
        path: ADMIN_PATH.NOTICE,
        title: ADMIN_TITLE.NOTICE,
        icon: ADMIN_ICON.NOTICE,
      },
    ];

    this.userMenuItems = [
      { path: USER_PATH.HOME, title: USER_TITLE.HOME, icon: USER_ICON.HOME },
      {
        path: USER_PATH.EDIT_PROFILE,
        title: USER_TITLE.EDIT_PROFILE,
        icon: USER_ICON.EDIT_PROFILE,
      },
      {
        path: USER_PATH.VACATION,
        title: USER_TITLE.VACATION,
        icon: USER_ICON.VACATION,
      },
      {
        path: USER_PATH.NOTICE,
        title: USER_TITLE.NOTICE,
        icon: USER_ICON.NOTICE,
      },
      {
        path: USER_PATH.COURSE,
        title: USER_TITLE.COURSE,
        icon: USER_ICON.COURSE,
      },
      { path: USER_PATH.PEER, title: USER_TITLE.PEER, icon: USER_ICON.PEER },
      {
        path: USER_PATH.WORK_DETAIL,
        title: USER_TITLE.WORK_DETAIL,
        icon: USER_ICON.WORK_DETAIL,
      },
    ];
  }

  render() {
    const isAdmin = localStorage.getItem('admin');
    const menuItems = isAdmin ? this.adminMenuItems : this.userMenuItems;

    const menuHTML = menuItems
      .map(
        item => `
        <li class="menu-item">
          <a href="${item.path}" class="menu-link">
            <span class="material-symbols-rounded">
              ${item.icon}
            </span>
            ${item.title}
          </a>
        </li>
      `,
      )
      .join('');

    this.element.innerHTML = `
      <div class="menu-top">
        <div class="logo-circle"></div>
        <h1>DOPAMING</h1>
      </div>
      <ul class="menu">${menuHTML}</ul>
    `;

    this.updateActiveLink(window.location.pathname);
  }

  updateActiveLink(path) {
    const links = this.element.querySelectorAll('.menu-link');
    links.forEach(link => {
      if (link.getAttribute('href') === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
