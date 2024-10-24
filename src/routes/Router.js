import { RenderHeader, RenderNavbar } from '../components';
import RenderLayout from '../layout/Layout';
// import { RenderAdminHome, RenderAdminMemberManagement, RenderAdminVacationManagement, RenderAdminNoticeManagement
//   ,RenderUserHome,RenderUserEditProfile,RenderUserWorkDetail,RenderUserVacationManagement,RenderUserNotice,RenderUserPeer,RenderUserCourse
//   ,RenderNotFound,RenderSignIn
// } from '../pages';
import {
  RenderAdminHome,
  RenderAdminMemberManagement,
  RenderUserHome,
  RenderUserNotice,
  RenderUserEditProfile,
  RenderUserPeer,
  RenderNotFound,
  RenderLogIn,
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

import { getIsMobile } from '../utils/responsive';
import { getItem } from '../utils/storage';

export default function Router() {
  const path = window.location.pathname;

  const isMobile = getIsMobile();
  const role = getItem('userRole');

  const root = document.querySelector('#root');

  // 로그인하지 않은 사용자
  if (!role) {
    // 로그인 페이지가 아닌 다른 페이지에 접근하려고 할 때
    if (path !== '/login') {
      window.location.replace('/login');
      return;
    }

    RenderLogIn(root, '../../server/data/users.json');
    return;
  }

  // 로그인한 사용자의 권한에 맞지 않는 경로로 접근하려고 할 때
  if (role === 'admin' && !path.startsWith(ADMIN_PATH.HOME)) {
    window.location.replace(ADMIN_PATH.HOME);
    return;
  } else if (role === 'user' && path.startsWith(ADMIN_PATH.HOME)) {
    window.location.replace(USER_PATH.HOME);
    return;
  }

  RenderLayout(root);

  const headerEl = document.querySelector('header');
  const navbarEl = document.querySelector('nav');
  const contentEl = document.querySelector('.content');

  if (role === 'admin') {
    RenderHeader(headerEl, false);
    RenderNavbar(navbarEl, false, [
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
    if (isMobile) {
      RenderNavbar(navbarEl, true, [
        { path: USER_PATH.NOTICE, title: '공지목록', icon: USER_ICON.NOTICE },
        {
          path: USER_PATH.VACATION,
          title: '휴가/공가',
          icon: USER_ICON.VACATION,
        },
        { path: USER_PATH.HOME, title: USER_TITLE.HOME, icon: USER_ICON.HOME },
        { path: USER_PATH.PEER, title: '수강생', icon: USER_ICON.PEER },
        {
          path: USER_PATH.COURSE,
          title: USER_TITLE.COURSE,
          icon: USER_ICON.COURSE,
        },
      ]);
    } else {
      RenderNavbar(navbarEl, true, [
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
    case USER_PATH.NOTICE:
      RenderUserNotice(contentEl, '../../server/data/company_posts.json');
      break;
    case USER_PATH.EDIT_PROFILE:
      RenderUserEditProfile(contentEl);
      break;
    case USER_PATH.PEER:
      RenderUserPeer(contentEl, '../../server/data/users.json');
      break;
    default:
      RenderNotFound(root);
      break;
  }
}
