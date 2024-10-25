// generateCalendar.js
export const generateCalendar = (container, year, month, filteredUsers) => {
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
