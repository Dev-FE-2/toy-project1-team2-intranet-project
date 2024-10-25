import './WorkInfo.css';
import axios from 'axios';

export const WorkInfo = async userId => {
  const jsonFilePath = '../../../../server/data/time_punch.json';

  try {
    const response = await axios.get(jsonFilePath);
    const users = response.data;

    // 데이터 로드 확인
    console.log('전체 사용자 데이터:', users);

    // 특정 사용자 필터링
    const filteredUsers = users.filter(user => user.user_id === userId);

    // 필터링된 사용자 데이터 확인
    console.log('필터링된 사용자 데이터:', filteredUsers);

    // 기본 사용자 정보 초기화
    let userName =
      filteredUsers.length > 0 ? filteredUsers[0].user_name : '사용자';
    let punchInTime = '';
    let punchOutTime = '';
    let breakOutTime = '';
    let breakInTime = '';

    if (filteredUsers.length > 0) {
      const selectedUserData = filteredUsers[0];
      punchInTime = selectedUserData.punch_in
        ? new Date(selectedUserData.punch_in).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';
      punchOutTime = selectedUserData.punch_out
        ? new Date(selectedUserData.punch_out).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';
      breakOutTime = selectedUserData.break_out
        ? new Date(selectedUserData.break_out).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';
      breakInTime = selectedUserData.break_in
        ? new Date(selectedUserData.break_in).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';
    }

    return `
      <div class="work-header">
        <div class="work-title">
          <p class="work-title-text">출/퇴근 상세정보</p>
          <input type="date" class="punch-date" value="${new Date().toISOString().split('T')[0]}" />
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
              <p class="punch-in-time">${punchInTime || '--시 --분'}</p>
              <p class="punch-out-time">${punchOutTime || '--시 --분'}</p>
              <p class="break-outtime">${breakOutTime || '--시 --분'}</p>
              <p class="break-in-time">${breakInTime || '--시 --분'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('사용자 데이터를 가져오는 중 오류 발생! :', error);
  }
};
