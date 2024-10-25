import './WorkDetail.css';
import axios from 'axios';
import { WorkInfo } from '../../../../src/components/user/work-info/WorkInfo';

let currentYear;
let currentMonth;
let filteredUsers = []; // 필터링된 사용자 데이터

const generateCalendar = (container, year, month) => {
  const calendarContainer = container.querySelector('.work-calendar');
  const calendarTitle = container.querySelector('.calendar-title');
  calendarContainer.innerHTML = '';

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  daysOfWeek.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    calendarContainer.appendChild(dayElement);
  });

  const date = new Date(year, month, 1);
  const firstDay = date.getDay(); // 첫 번째 날의 요일
  const totalDays = new Date(year, month + 1, 0).getDate(); // 해당 월의 총 일수

  // 비어 있는 셀 추가
  for (let i = 0; i < firstDay; i++) {
    const emptyElement = document.createElement('div');
    emptyElement.className = 'calendar-day';
    calendarContainer.appendChild(emptyElement);
  }

  // 각 날짜에 대한 셀 생성
  for (let i = 1; i <= totalDays; i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = i;

    const userDataForDate = filteredUsers.filter(user => {
      const punchDate = new Date(user.punch_date);
      return (
        punchDate.getDate() === i &&
        punchDate.getMonth() === month &&
        punchDate.getFullYear() === year
      );
    });

    // 사용자 데이터가 있을 경우
    if (userDataForDate.length > 0) {
      const userData = userDataForDate[0];
      dayElement.innerHTML += `
      <div class="cal-punch-group">
        ${userData.punch_in ? `<p class="cal-punch-in-time">출근</p>` : ''}
        ${userData.break_out ? `<p class="cal-break-out">외출</p>` : ''}
      </div>
    `;

      // 퇴근과 복귀가 있는 경우
      if (userData.punch_out || userData.break_in) {
        dayElement.innerHTML += `
        <div class="cal-punch-group">
          ${userData.punch_out ? `<p class="cal-punch-out-time">퇴근</p>` : ''}
          ${userData.break_in ? `<p class="cal-break-in">복귀</p>` : ''}
        </div>
      `;
      }
    }

    calendarContainer.appendChild(dayElement);
  }

  // 디자인형식을 맞추기 위함
  const totalCells = 35;
  const remainingCells = totalCells - (firstDay + totalDays);
  for (let i = 0; i < remainingCells; i++) {
    const emptyElement = document.createElement('div');
    emptyElement.className = 'calendar-day';
    calendarContainer.appendChild(emptyElement);
  }

  calendarTitle.textContent = `${year}년 ${month + 1}월`;
};

const updatePunchInfo = (container, selectedDate) => {
  const punchInfoTime = container.querySelector('.punch-info-time');

  // 선택 날짜에 해당 데이터 찾기
  const selectedUserData = filteredUsers.find(user => {
    const punchDate = new Date(user.punch_date);

    // selectedDate에서 하루 전날 계산
    const dayBeforeSelectedDate = new Date(selectedDate);
    dayBeforeSelectedDate.setDate(dayBeforeSelectedDate.getDate() - 1);

    return (
      punchDate.toISOString().split('T')[0] ===
      dayBeforeSelectedDate.toISOString().split('T')[0]
    ); // ISO 형식으로 비교 형식 :2017-03-16T17:40:00+09:00
  });

  if (selectedUserData) {
    const punchInTime = new Date(selectedUserData.punch_in);
    const punchOutTime = new Date(selectedUserData.punch_out);
    const breakOutTime = selectedUserData.break_out
      ? new Date(selectedUserData.break_out)
      : null;
    const breakInTime = selectedUserData.break_in
      ? new Date(selectedUserData.break_in)
      : null;

    punchInfoTime.innerHTML = `
      <p class="punch-in-time">${punchInTime.getHours()}시 ${punchInTime.getMinutes()}분</p>
      <p class="punch-out-time">${punchOutTime.getHours()}시 ${punchOutTime.getMinutes()}분</p>
      ${breakOutTime ? `<p class="break-outtime">${breakOutTime.getHours()}시 ${breakOutTime.getMinutes()}분</p>` : ''}
      ${breakInTime ? `<p class="break-in-time">${breakInTime.getHours()}시 ${breakInTime.getMinutes()}분</p>` : ''}
    `;
  } else {
    punchInfoTime.innerHTML = `
      <p class="punch-in-time">--시 --분</p>
      <p class="punch-out-time">--시 --분</p>
      <p class="break-ot-time">--시 --분</p>
      <p class="break-in-time">--시 --분</p>
    `;
  }
};

const fetchFilteredUsers = async userId => {
  const jsonFilePath = '../../../../server/data/time_punch.json';
  try {
    const response = await axios.get(jsonFilePath);
    const users = response.data;
    return users.filter(user => user.user_id === userId);
  } catch (error) {
    console.error('사용자 데이터를 가져오는 중 오류 발생! :', error);
    return [];
  }
};

export const RenderUserWorkDetail = async container => {
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();

  const specificUserId = '231231232'; // 특정 테스트 ID

  // WorkInfo 컴포넌트 호출 및 HTML 삽입
  const workInfoHTML = await WorkInfo(specificUserId);
  filteredUsers = await fetchFilteredUsers(specificUserId); // 필터링된 사용자 데이터 가져오기

  container.innerHTML = `
    ${workInfoHTML}
    <div class="work-calendar-box">
      <div class="title-content"> 
        <span class="material-symbols-rounded" id="calendar-before">arrow_circle_left</span>
        <p class="calendar-title"></p>
        <span class="material-symbols-rounded" id="calendar-after">arrow_circle_right</span>
      </div>
      <div class="work-calendar"></div>
    </div>
  `;

  generateCalendar(container, currentYear, currentMonth);
  updatePunchInfo(container, today.toISOString().split('T')[0]); // 오늘 날짜로 초기화

  // 아이콘 클릭
  container.querySelector('#calendar-before').addEventListener('click', () => {
    if (currentMonth === 0) {
      currentYear -= 1;
      currentMonth = 11;
    } else {
      currentMonth -= 1;
    }
    generateCalendar(container, currentYear, currentMonth);
    updatePunchInfo(container, container.querySelector('.punch-date').value); // 날짜 업데이트
  });

  container.querySelector('#calendar-after').addEventListener('click', () => {
    if (currentMonth === 11) {
      currentYear += 1;
      currentMonth = 0;
    } else {
      currentMonth += 1;
    }
    generateCalendar(container, currentYear, currentMonth);
    updatePunchInfo(container, container.querySelector('.punch-date').value); // 날짜 업데이트
  });

  // 날짜 선택
  container.querySelector('.punch-date').addEventListener('change', event => {
    const selectedDate = event.target.value;
    updatePunchInfo(container, selectedDate); // 해당 날짜의 정보 업데이트
  });
};
