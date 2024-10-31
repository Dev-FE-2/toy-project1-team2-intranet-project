import './WorkInfo.css';
import { fetchTimePunchData } from '../../../../server/api/user';

export const WorkInfo = async (userId, date) => {
  try {
    const userTimePunchData = await fetchTimePunchData(userId); // 사용자 출퇴근 데이터 가져오기

    // date가 Date 객체가 아니라면 형식 변환
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const dateString = date.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식

    // 특정 날짜의 데이터 필터링
    const filteredUserData = userTimePunchData.find(
      data => data.punch_date === dateString,
    );

    // 기본 사용자 정보 초기화
    let userName = '사용자';
    let punchInTime = '--시 --분';
    let punchOutTime = '--시 --분';
    let breakOutTime = '--시 --분';
    let breakInTime = '--시 --분';

    if (filteredUserData) {
      userName = filteredUserData.user_name || userName;

      punchInTime = filteredUserData.punch_in
        ? new Date(filteredUserData.punch_in).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : punchInTime;

      punchOutTime = filteredUserData.punch_out
        ? new Date(filteredUserData.punch_out).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : punchOutTime;

      breakOutTime = filteredUserData.break_out
        ? new Date(filteredUserData.break_out).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : breakOutTime;

      breakInTime = filteredUserData.break_in
        ? new Date(filteredUserData.break_in).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : breakInTime;
    } else {
      console.log('해당 날짜와 사용자에 대한 출퇴근 데이터가 없습니다.');
    }

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const htmlOutput = `
        <div class="work-header">
          <div class="work-title">
            <p class="work-title-text">출/퇴근 상세정보</p>
            <input type="date" class="punch-date" value="${dateString}" />
          </div>
          <div class="work-content">
            <p class="work-desc">오늘 하루도 파이팅 하세요!<br>${userName}님의 매일을 응원합니다</p>
            <div class="punch-info">
              <div class="punch-info-title">
                <p class="punch-in">출근</p>
                <p class="punch-out">퇴근</p>
                <p class="break-out">외출</p>
                <p class="break-in">복귀</p>
              </div>
              <div class="punch-info-time">
                <p class="punch-in-time">${punchInTime}</p>
                <p class="punch-out-time">${punchOutTime}</p>
                <p class="break-outtime">${breakOutTime}</p>
                <p class="break-in-time">${breakInTime}</p>
              </div>
            </div>
          </div>
        </div>
      `;

    return {
      userInfo: filteredUserData || null,
      html: htmlOutput,
      currentTime,
    };
  } catch (error) {
    console.error('오류 발생!', error);
    return { userInfo: null, html: '', currentTime: '' };
  }
};
