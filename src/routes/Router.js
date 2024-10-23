import { RenderHeader, RenderNavbar } from '../components';
import RenderLayout from '../layout/Layout';

import {
  RenderAdminHome,
  RenderAdminMemberManagement,
  RenderUserHome,
  RenderUserPeer,
  RenderNotFound,
} from '../pages';
import {
  ADMIN_PATH,
  USER_PATH,
  ADMIN_TITLE,
  USER_TITLE,
  ADMIN_ICON,
  USER_ICON,
  // ICONS,
} from '../utils/constants';
import { getUserRole } from '../utils/storage';

export default function Router(newPath) {
  const path = window.location.pathname;

  if (newPath && newPath !== path) {
    history.pushState(null, null, newPath);
  }

  const root = document.querySelector('#root');
  RenderLayout(root);

  const headerEl = document.querySelector('.header');
  const navbarEl = document.querySelector('.navbar');
  const contentEl = document.querySelector('.content');

  const role = getUserRole();

  if (role === 'admin') {
    RenderHeader(headerEl, false);
    RenderNavbar(navbarEl, [
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
    ]);
  } else {
    RenderHeader(headerEl, true, USER_PATH.EDIT_PROFILE);
    RenderNavbar(navbarEl, [
      { path: USER_PATH.HOME, title: USER_TITLE.HOME, icon: USER_ICON.HOME },
      {
        path: USER_PATH.EDIT_PROFILE,
        title: USER_TITLE.EDIT_PROFILE,
        icon: USER_ICON.EDIT_PROFILE,
      },
      {
        path: USER_PATH.WORK_DETAIL,
        title: USER_TITLE.WORK_DETAIL,
        icon: USER_ICON.WORK_DETAIL,
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
      { path: USER_PATH.PEER, title: USER_TITLE.PEER, icon: USER_ICON.PEER },
      {
        path: USER_PATH.COURSE,
        title: USER_TITLE.COURSE,
        icon: USER_ICON.COURSE,
      },
    ]);
  }

  switch (path) {
    case ADMIN_PATH.HOME:
      RenderAdminHome(contentEl);
      break;
    case ADMIN_PATH.MEMBER:
      RenderAdminMemberManagement(contentEl);
      break;
    case USER_PATH.HOME:
      RenderUserHome(contentEl);
      break;
    case USER_PATH.PEER:
      RenderUserPeer(contentEl);
      break;
    default:
      RenderNotFound(root);
      break;
  }
}
