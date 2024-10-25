import './WorkInfo.css';
import axios from 'axios'; // axios 임포트 추가

export const WorkInfo = async (userId, date) => {
  const jsonFilePath = '../../../../server/data/time_punch.json';

  try {
    const response = await axios.get(jsonFilePath);
    const users = response.data;

    console.log('전체 사용자 데이터:', users);

    // 특정 사용자 필터링 (punch_date 사용)
    const filteredUsers = users.filter(
      user => user.user_id === userId && user.punch_date === date,
    );

    console.log(`Filtering with userId: ${userId} and punchDate: ${date}`);
    console.log('필터링된 사용자 데이터:', filteredUsers);

    // 기본 사용자 정보 초기화
    let userName = '사용자';
    let punchInTime = '--시 --분';
    let punchOutTime = '--시 --분';
    let breakOutTime = '--시 --분';
    let breakInTime = '--시 --분';

    if (filteredUsers.length > 0) {
      const selectedUserData = filteredUsers[0];
      userName = selectedUserData.user_name || userName;

      punchInTime = selectedUserData.punch_in
        ? new Date(selectedUserData.punch_in).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24시간 형식으로 출력
          })
        : punchInTime;

      punchOutTime = selectedUserData.punch_out
        ? new Date(selectedUserData.punch_out).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24시간 형식으로 출력
          })
        : punchOutTime;

      breakOutTime = selectedUserData.break_out
        ? new Date(selectedUserData.break_out).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24시간 형식으로 출력
          })
        : breakOutTime;

      breakInTime = selectedUserData.break_in
        ? new Date(selectedUserData.break_in).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24시간 형식으로 출력
          })
        : breakInTime;
    }

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24시간 형식으로 출력
    });

    const htmlOutput = `
      <div class="work-header">
        <div class="work-title">
          <p class="work-title-text">출/퇴근 상세정보</p>
          <input type="date" class="punch-date" value="${date}" />
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
      userInfo: filteredUsers.length > 0 ? filteredUsers[0] : null,
      html: htmlOutput,
      currentTime,
    };
  } catch (error) {
    console.error('사용자 데이터를 가져오는 중 오류 발생! :', error);
    return { userInfo: null, html: '', currentTime: '' }; // 에러 발생 시 기본값 반환
  }
};
