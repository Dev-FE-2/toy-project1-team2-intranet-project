import { setItem } from '../../src/utils/storage'; // setItem 가져오기
import firebaseServices from '../../src/firebaseConfig';
import { ADMIN_PATH, USER_PATH } from '../../src/utils/constants';
import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth'; // 로그인 함수
import { Modal } from '../../src/components/ui/modal/Modal';
import { getDatabase, ref, get, set } from 'firebase/database';
import { formatDate } from '../../src/utils/currentTime';

// 1. 로그인
export const userLogin = async (email, password) => {
  try {
    // Firebase 로그인 시도
    const userCredential = await signInWithEmailAndPassword(
      firebaseServices.auth,
      email,
      password,
    );

    const user = userCredential.user; // 사용자 정보 가져오기

    // 이메일에 따라 리다이렉트 경로, 역할 설정
    const redirectPath =
      email === 'admin@naver.com' ? ADMIN_PATH.HOME : USER_PATH.HOME;
    setItem('userRole', email === 'admin@naver.com' ? 'admin' : 'user');
    setItem('userID', user.uid); // 로컬 스토리지에 사용자 ID 저장
    setItem('userName', user.displayName || '이름이 설정되지 않음'); // 로컬 스토리지에 사용자 이름 저장

    // 해당 경로로 리다이렉트
    window.location.replace(redirectPath);
  } catch {
    Modal('login-fail');
  }
};

// 2. 현재 로그인한 사용자 id와 name 갖고오기
export const getUserIdName = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async user => {
      if (user) {
        const userId = user.uid; // 로그인한 사용자의 ID
        const db = getDatabase();
        const userRef = ref(db, `Users/${userId}`); // Realtime Database의 사용자 경로 참조

        try {
          const snapshot = await get(userRef); // 데이터 가져오기
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const currentUserInfo = {
              id: userId,
              name: userData.user_name || '사용자 이름이 없습니다', // Realtime Database에서 user_name 가져오기
            };
            console.log('로그인한 사용자 ID:', currentUserInfo.id);
            console.log('로그인한 사용자 이름:', currentUserInfo.name);
            resolve(currentUserInfo); // 사용자 정보를 resolve로 반환
          } else {
            reject(new Error('사용자 데이터가 존재하지 않습니다.'));
          }
        } catch (error) {
          reject(new Error('사용자 데이터 가져오기 실패: ' + error.message));
        }
      } else {
        console.log('사용자가 로그아웃했습니다.');
        reject(new Error('사용자가 로그아웃했습니다.'));
      }
    });
  });
};

// 3. 사용자 데이터 가져오기
export const fetchUserData = async userId => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
  console.log('userId : ', userId);
  const userRef = ref(db, `Users/${userId}`); // 사용자 경로 참조

  try {
    const snapshot = await get(userRef); // 데이터 가져오기
    if (snapshot.exists()) {
      const userData = snapshot.val(); // 데이터 값 가져오기
      return userData; // 사용자 객체 데이터 반환
    } else {
      console.log('사용자 데이터가 존재하지 않습니다.');
      return null; // 데이터가 없을 경우 null 반환
    }
  } catch (error) {
    console.error('사용자 데이터 가져오기 실패:', error.message); // 오류 메시지 출력
    return null; // 오류 발생 시 null 반환
  }
};

// 모든 사용자 데이터 가져오기
export const fetchAllUsersData = async () => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
  const usersRef = ref(db, 'Users'); // Users 경로 참조

  try {
    const snapshot = await get(usersRef); // 데이터 가져오기
    if (snapshot.exists()) {
      const usersData = snapshot.val(); // 데이터 값 가져오기
      return Object.values(usersData); // 사용자 객체 배열 반환
    } else {
      console.log('사용자 데이터가 존재하지 않습니다.');
      return []; // 데이터가 없을 경우 빈 배열 반환
    }
  } catch (error) {
    console.error('사용자 데이터 가져오기 실패:', error.message); // 오류 메시지 출력
    return []; // 오류 발생 시 빈 배열 반환
  }
};

// 4. 출/퇴근 데이터 가져오기
export const fetchTimePunchData = async userId => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
  const timePunchRef = ref(db, 'Time-punch'); // 출/퇴근, 외출/복귀 데이터테이블

  try {
    const snapshot = await get(timePunchRef); // 데이터 가져오기
    if (snapshot.exists()) {
      const timePunchData = snapshot.val(); // 데이터 값 가져오기
      console.log('전체 출퇴근 데이터:', timePunchData); // 전체 데이터 로그

      // 현재 로그인한 사용자의 출근/퇴근 데이터 필터링
      const userTimePunch = [];

      // 각 사용자 ID와 날짜를 순회하여 해당 사용자 데이터를 필터링
      Object.entries(timePunchData).forEach(([userIdKey, userPunchData]) => {
        if (userIdKey === userId) {
          console.log('사용자 ID:', userIdKey); // 사용자 ID 로그
          Object.entries(userPunchData).forEach(([dateKey, punchDetails]) => {
            console.log(`날짜: ${dateKey}, 출퇴근 세부정보:`, punchDetails); // 날짜 및 세부정보 로그
            userTimePunch.push({ punch_date: dateKey, ...punchDetails }); // 해당 사용자 데이터 추가
          });
        }
      });

      console.log('사용자 출퇴근 데이터:', userTimePunch); // 필터링된 사용자 데이터 로그
      return userTimePunch.length > 0 ? userTimePunch : []; // 사용자 데이터 반환
    } else {
      console.log('Time-punch 데이터가 존재하지 않습니다.');
      return []; // 데이터가 없을 경우 빈 배열 반환
    }
  } catch (error) {
    console.error('출근/퇴근 데이터 가져오기 실패:', error.message); // 오류 메시지 출력
    return []; // 오류 발생 시 빈 배열 반환
  }
};

// 5. 출 퇴근 외출 복귀 데이터 저장하기
export const saveTimePunchData = async (userId, actionType, userName) => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
  const now = new Date(); // 현재 Date 객체 생성

  const date = formatDate(now); // formatDate를 사용하여 날짜 포맷팅
  const localTimestamp = now.toLocaleString('sv-SE', {
    timeZone: 'Asia/Seoul',
  }); // YYYY-MM-DD HH:mm:ss 형식으로 로컬 타임스탬프 생성
  const timestamp = localTimestamp.replace('T', ' ').slice(0, 19); // YYYY-MM-DD HH:mm:ss 형식
  const punchId = `${userId}_${date.replace(/-/g, '')}`; // punch_id 생성

  // 저장되는 데이터 구조
  const newData = {
    punch_date: date,
    punch_id: punchId,
    user_id: userId,
    user_name: userName,
    punch_in: actionType === 'punch-in' ? timestamp : null,
    punch_out: actionType === 'punch-out' ? timestamp : null,
    break_in: actionType === 'break-in' ? timestamp : null,
    break_out: actionType === 'break-out' ? timestamp : null,
  };

  // null 값을 삭제하여 undefined가 발생하지 않도록 처리
  Object.keys(newData).forEach(key => {
    if (newData[key] === null) {
      delete newData[key];
    }
  });

  try {
    // 해당 날짜의 기존 데이터 가져오기
    const existingDataRef = ref(db, `Time-punch/${userId}/${date}`);
    const snapshot = await get(existingDataRef);

    if (snapshot.exists()) {
      // 기존 데이터가 있는 경우
      const existingData = snapshot.val(); // 기존 데이터 가져오기

      // 기존 데이터의 객체를 newData로 업데이트
      const updatedData = {
        ...existingData, // 기존 데이터 유지
        ...newData, // 새로운 데이터로 업데이트
      };

      // 업데이트된 데이터 저장
      await set(existingDataRef, updatedData);
    } else {
      // 기존 데이터가 없는 경우 새로 생성
      await set(existingDataRef, newData); // 객체로 데이터 저장
    }

    console.log(`${actionType} 데이터가 성공적으로 저장되었습니다.`, newData);
  } catch (error) {
    console.error(`${actionType} 데이터 저장 실패:`, error.message);
    Modal(actionType); // 오류 발생 시 모달 표시
  }
};

// 6. 내 정보 수정하기.
export const updateUserData = async (container, userId) => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
  const userRef = ref(db, `Users/${userId}`); // 사용자 경로 참조

  // 입력값 가져오기
  const updatedData = {
    user_name: container.querySelector('#name').value,
    user_email: container.querySelector('#email').value,
    user_phone: container.querySelector('#phone').value,
    user_birthday: container.querySelector('#birthDate').value,
    user_sex: container.querySelector('#gender').value === 'male' ? '남' : '여',
    user_position:
      container.querySelector('#role').value === 'manager' ? '매니저' : '학생',
    //user_image: currUser.user_image, // 사용자 이미지 URL
  };

  try {
    await set(userRef, updatedData); // 사용자 데이터 업데이트
    console.log('사용자 데이터가 성공적으로 수정되었습니다.');
  } catch (error) {
    console.error('사용자 데이터 수정 실패:', error.message);
    Modal('update-fail'); // 오류 발생 시 모달 표시
  }
};
