import {
  ADMIN_PATH,
  USER_PATH,
  ADMIN_TITLE,
  USER_TITLE,
} from '../utils/constants';
import AdminHomePage from '../pages/admin/home/Home';
import AdminMemberPage from '../pages/admin/member/Member';
import AdminNoticePage from '../pages/admin/notice/Notice';
import AdminVactionManagementPage from '../pages/admin/vacation-management/VacationManagement';
import UserHomePage from '../pages/user/home/Home';
import UserEditProfilePage from '../pages/user/edit-profile/EditProfile';
import UserVacationManagementPage from '../pages/user/vacation-management/VacationManagement';
import UserNoticePage from '../pages/user/notice/Notice';
import UserCoursePage from '../pages/user/course/Course';
import UserPeerPage from '../pages/user/peer/Peer';
import UserWorkDetailPage from '../pages/user/work-detail/WorkDetail';
import NotFound from '../pages/not-found/NotFound';

export default class Router {
  constructor(layout) {
    this.layout = layout;
    this.currentPage = null;
    this.routes = {
      [ADMIN_PATH.HOME]: { title: ADMIN_TITLE.HOME, component: AdminHomePage },
      [ADMIN_PATH.MEMBER]: {
        title: ADMIN_TITLE.MEMBER,
        component: AdminMemberPage,
      },
      [ADMIN_PATH.VACATION]: {
        title: ADMIN_TITLE.VACATION,
        component: AdminVactionManagementPage,
      },
      [ADMIN_PATH.NOTICE]: {
        title: ADMIN_TITLE.NOTICE,
        component: AdminNoticePage,
      },

      [USER_PATH.HOME]: { title: USER_TITLE.HOME, component: UserHomePage },
      [USER_PATH.EDIT_PROFILE]: {
        title: USER_TITLE.EDIT_PROFILE,
        component: UserEditProfilePage,
      },
      [USER_PATH.VACATION]: {
        title: USER_TITLE.VACATION,
        component: UserVacationManagementPage,
      },
      [USER_PATH.NOTICE]: {
        title: USER_TITLE.NOTICE,
        component: UserNoticePage,
      },
      [USER_PATH.COURSE]: {
        title: USER_TITLE.COURSE,
        component: UserCoursePage,
      },
      [USER_PATH.PEER]: { title: USER_TITLE.PEER, component: UserPeerPage },
      [USER_PATH.WORK_DETAIL]: {
        title: USER_TITLE.WORK_DETAIL,
        component: UserWorkDetailPage,
      },
    };
    this.notFoundPage = new NotFound();
  }

  // 라우터 초기화
  init(isAdmin) {
    this.isAdmin = isAdmin;
    window.addEventListener('popstate', () => this.route());
    this.route();
  }

  navigate(url) {
    window.history.pushState(null, null, url);
    this.route();
  }

  route() {
    const path = window.location.pathname;

    const route = this.routes[path];
    if (route) {
      this.renderPage(route);
      this.layout.updateActiveNavLink(path);
    } else {
      this.renderNotFound();
    }
  }

  // 이전 페이지 정리, 새 페이지 생성 및 렌더링
  renderPage(route) {
    if (this.currentPage && this.currentPage.cleanUp) {
      this.currentPage.cleanUp();
    }
    this.currentPage = new route.component();
    document.title = route.title;
    this.layout.setContent(this.currentPage);
    this.layout.updateActiveNavLink(route.path);
  }

  renderNotFound() {
    this.layout.setContent(this.notFoundPage);
  }
}
