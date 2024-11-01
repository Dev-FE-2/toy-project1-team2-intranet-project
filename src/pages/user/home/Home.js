import './Home.css';
import {
  RenderCourseExplain,
  RenderPunchTime,
  RenderNoticeGallery,
  RenderVacationTable,
  WorkInfo,
} from '../../../components';
import { formatDate } from '../../../utils/currentTime';
import { INFO } from '../../../utils/constants';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  fetchTimePunchData,
  getUserAbs,
  getAllNotices,
} from '../../../../server/api/user'; // 사용자 데이터 가져오기

export const RenderUserHome = async container => {
  container.innerHTML = `<div class="loading">사용자 정보를 가져오는 중입니다.</div>`;

  const auth = getAuth(); // 인증 인스턴스 가져오기

  onAuthStateChanged(auth, async user => {
    if (!user) {
      console.error('사용자가 로그인하지 않았습니다.');
      return;
    }

    const today = formatDate(new Date()); // 오늘 날짜를 YYYY-MM-DD 형식으로 포맷
    const userId = user.uid; // 현재 로그인한 사용자의 고유 ID

    try {
      const noticeData = await getAllNotices(); // 공지 데이터 가져오기
      const absData = await getUserAbs(userId); // 결석 데이터 가져오기
      const timePunchData = await fetchTimePunchData(userId); // 출근/퇴근 데이터 가져오기

      // 오늘 날짜에 해당하는 데이터 필터링
      const todayData = timePunchData.filter(
        punch => punch.punch_date === today,
      );
      // container가 null인지 확인
      if (!container) {
        console.error('container 요소가 존재하지 않습니다.');
        return;
      }

      container.innerHTML = `
        <div class="home-container">
          <div class="home-left">
            <section class="course-explain-container">
              <article></article>
            </section>
            <section class="notice-gallery-container">
              <article></article>
            </section>
          </div>
          <div class="home-right">
            <section class="punch-time-container">
              <article></article>
            </section>
            <section class="vacation-table-container">
              <article></article>
            </section>
          </div>
        </div>
      `;

      // 오늘 날짜의 출퇴근 정보를 WorkInfo에 전달하여 렌더링 및 분류
      const workInfo = await WorkInfo(userId, today); // userId와 현재 날짜 전달

      const punchTimeContainer = container.querySelector(
        '.punch-time-container article',
      );

      // Ensure punchTimeContainer is defined
      if (!punchTimeContainer) {
        console.error(
          '.punch-time-container article 요소가 존재하지 않습니다.',
        );
        return;
      }

      // 출퇴근 정보 업데이트
      const userPunchData =
        todayData.length > 0 ? todayData : [workInfo.userInfo];
      punchTimeContainer.innerHTML = `
        <p class="punch-in-time">${userPunchData[0]?.punch_in ? new Date(userPunchData[0].punch_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--시 --분'}</p>
        <p class="punch-out-time">${userPunchData[0]?.punch_out ? new Date(userPunchData[0].punch_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--시 --분'}</p>
        <p class="break-outtime">${userPunchData[0]?.break_out ? new Date(userPunchData[0].break_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--시 --분'}</p>
        <p class="break-in-time">${userPunchData[0]?.break_in ? new Date(userPunchData[0].break_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--시 --분'}</p>
      `;

      // RenderPunchTime에 올바른 데이터 전달
      RenderPunchTime(punchTimeContainer, userPunchData); // userPunchData로 전달

      // 각 컴포넌트 렌더링
      const courseExplainContainer = container.querySelector(
        '.course-explain-container article',
      );
      if (courseExplainContainer) {
        RenderCourseExplain(
          courseExplainContainer,
          INFO.BC_START_DATE,
          INFO.BC_END_DATE,
        );
      } else {
        console.error(
          '.course-explain-container article 요소가 존재하지 않습니다.',
        );
      }

      const noticeGalleryContainer = container.querySelector(
        '.notice-gallery-container article',
      );
      if (noticeGalleryContainer) {
        RenderNoticeGallery(noticeGalleryContainer, noticeData);
      } else {
        console.error(
          '.notice-gallery-container article 요소가 존재하지 않습니다.',
        );
      }

      const vacationTableContainer = container.querySelector(
        '.vacation-table-container article',
      );
      if (vacationTableContainer) {
        RenderVacationTable(vacationTableContainer, absData);
      } else {
        console.error(
          '.vacation-table-container article 요소가 존재하지 않습니다.',
        );
      }
    } catch (e) {
      console.error('홈 페이지에서 데이터를 가져오는 중 오류 발생 ! :', e);
    }
  });
};
