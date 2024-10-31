import { setItem } from '../../src/utils/storage'; // setItem 가져오기
import firebaseServices from '../../src/firebaseConfig';
import { ADMIN_PATH, USER_PATH } from '../../src/utils/constants';
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'; // 로그인 함수
import { clearStorage } from '../../src/utils/storage';
import { Modal } from '../../src/components/ui/modal/Modal';
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
  remove,
} from 'firebase/database';
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
    onAuthStateChanged(auth, user => {
      if (user) {
        const currentUserInfo = {
          id: user.uid, // 로그인한 사용자의 ID 저장
          name: user.displayName || '이름이 설정되지 않음', // 사용자 이름 저장 (없으면 기본값)
        };
        console.log('로그인한 사용자 ID:', currentUserInfo.id);
        console.log('로그인한 사용자 이름:', currentUserInfo.name);
        resolve(currentUserInfo); // 사용자 정보를 resolve로 반환
      } else {
        console.log('사용자가 로그아웃했습니다.');
        reject(new Error('사용자가 로그아웃했습니다.')); // 로그아웃 시 reject
      }
    });
  });
};

// 3. 로그아웃
export const userLogout = () => {
  const auth = getAuth();

  signOut(auth)
    .then(() => {
      // 로그아웃 성공 시 로컬 스토리지 초기화
      clearStorage();
      // 로그아웃 후 로그인 페이지로 리다이렉트
      window.location.replace('/login');
    })
    .catch(error => {
      console.error('로그아웃 중 오류 발생:', error);
    });
};

// 2. 사용자 데이터 가져오기
export const fetchUserData = async userId => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
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

// 3. 출/퇴근 데이터 가져오기
export const fetchTimePunchData = async userId => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
  const timePunchRef = ref(db, 'Time-punch'); // 출/퇴근, 외출/복귀 데이터테이블

  try {
    const snapshot = await get(timePunchRef); // 데이터 가져오기
    if (snapshot.exists()) {
      const timePunchData = snapshot.val(); // 데이터 값 가져오기

      // 현재 로그인한 사용자의 출근/퇴근 데이터 필터링
      const userTimePunch = [];

      // 각 사용자 ID와 날짜를 순회하여 해당 사용자 데이터를 필터링
      Object.entries(timePunchData).forEach(([userPunchData]) => {
        Object.entries(userPunchData).forEach(([punchDetails]) => {
          if (punchDetails.user_id === userId) {
            userTimePunch.push(punchDetails); // 해당 사용자 데이터 추가
          }
        });
      });

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

// 4. 출 퇴근 외출 복귀 데이터 저장하기
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

// 5. 내 정보 수정하기
export const updateUserData = async (container, userId, userImage = null) => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
  const userRef = ref(db, `Users/${userId}`); // 사용자 경로 참조

  // 현재 데이터 가져오기_공백 입력시 업데이트 전에 있던 DB 값 사용하기 위함
  const snapshot = await get(userRef);
  const currentUserData = snapshot.exists() ? snapshot.val() : {};

  // 입력값 가져오기
  const updatedData = {
    user_name:
      container.querySelector('.user-profile-inputs #name').value ||
      currentUserData.user_name,
    user_email:
      container.querySelector('.user-profile-inputs #email').value ||
      currentUserData.user_email,
    user_phone:
      container.querySelector('.user-profile-inputs #phone').value ||
      currentUserData.user_phone,
    user_birthday:
      container.querySelector('.user-profile-inputs #birthDate').value ||
      currentUserData.user_birthday,
    user_sex:
      container.querySelector('.user-profile-inputs #gender').value === 'male'
        ? '남'
        : container.querySelector('.user-profile-inputs #gender').value ===
            'female'
          ? '여'
          : currentUserData.user_sex,
    user_position:
      container.querySelector('.user-profile-inputs #role').value === 'manager'
        ? '매니저'
        : container.querySelector('.user-profile-inputs #role').value ===
            'student'
          ? '학생'
          : currentUserData.user_position,
    // user_password: container.querySelector('.user-profile-inputs #confirm-password').value || currentUserData.user_password,
    user_image: userImage || currentUserData.user_image,
  };

  try {
    await update(userRef, updatedData);
    console.log('사용자 데이터가 성공적으로 수정되었습니다.');
  } catch (error) {
    console.error('사용자 데이터 수정 실패:', error.message);
    Modal('edit-profile-fail');
  }
};

// 부재 관련 API
// 부재 가져오기
export const getUserAbs = async userId => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
  const absRef = ref(db, `absences/${userId}`); // userId 별로 부재 데이터 접근

  try {
    // userId로 부재 데이터 가져오기
    const absSnapshot = await get(absRef);
    if (!absSnapshot.exists()) {
      return [];
    }

    // userId로 유저 데이터 가져오기
    const userData = await fetchUserData(userId);
    if (!userData) {
      console.log('해당 사용자 데이터가 없습니다.');
      return [];
    }

    // 합쳐서 반환
    const absences = [];
    absSnapshot.forEach(childSnapshot => {
      absences.push({
        abs_id: childSnapshot.key,
        ...childSnapshot.val(),
        user_name: userData.user_name,
        user_phone: userData.user_phone,
        user_position: userData.user_position,
        user_leftHoliday: userData.user_leftHoliday,
        user_totalHoliday: userData.user_totalHoliday,
      });
    });

    return absences;
  } catch (error) {
    console.error('사용자별 부재 불러오기 중 오류 발생:', error);
    throw error;
  }
};

// abs_id로 특정 부재 가져오기
export const getUserAbsById = async (userId, absenceId) => {
  const db = getDatabase(); // 데이터베이스 인스턴스 가져오기
  const absRef = ref(db, `absences/${userId}/${absenceId}`); // 특정 부재 데이터 접근

  try {
    const absSnapshot = await get(absRef);
    if (!absSnapshot.exists()) {
      console.log('해당 부재 데이터가 없습니다.');
      return null;
    }

    // userId로 유저 데이터 가져오기
    const userData = await fetchUserData(userId);
    if (!userData) {
      console.log('해당 사용자 데이터가 없습니다.');
      return null;
    }

    // 부재 데이터와 유저 데이터 합쳐서 반환
    return {
      abs_id: absenceId,
      ...absSnapshot.val(),
      user_name: userData.user_name,
      user_phone: userData.user_phone,
      user_position: userData.user_position,
      user_leftHoliday: userData.user_leftHoliday,
      user_totalHoliday: userData.user_totalHoliday,
    };
  } catch (error) {
    console.error('부재 데이터 불러오기 중 오류 발생:', error);
    throw error;
  }
};

// 부재 추가
export const addUserAbsence = async (userId, newAbsenceData) => {
  const db = getDatabase();
  const absRef = ref(db, `absences/${userId}`);

  try {
    const newAbsRef = await push(absRef, newAbsenceData); // 새 부재 데이터 추가
    console.log('부재 데이터가 성공적으로 추가되었습니다.');
    return { abs_id: newAbsRef.key, ...newAbsenceData }; // 추가된 데이터 반환
  } catch (error) {
    console.error('부재 데이터 추가 중 오류 발생:', error);
    throw error;
  }
};

// 부재 업데이트
export const updateUserAbsence = async (container, userId, absenceId) => {
  const db = getDatabase();
  const absenceRef = ref(db, `absences/${userId}/${absenceId}`);

  // 현재 데이터 가져오기_공백 입력시 업데이트 전에 있던 DB 값 사용하기 위함
  const snapshot = await get(absenceRef);
  const currentAbsData = snapshot.exists() ? snapshot.val() : {};

  const vacationTypeValue = container.querySelector(
    '.vacation-request-form-inputs #vacation-type',
  ).value;

  let vacationType;

  if (vacationTypeValue === 'officialLeave') {
    vacationType = '공가';
  } else if (vacationTypeValue === 'sickLeave') {
    vacationType = '병가';
  } else if (vacationTypeValue === 'annualLeave') {
    vacationType = '휴가';
  } else {
    //선택 안하면
    vacationType = currentAbsData.abs_type;
  }

  const fileInput = container.querySelector(
    '.vacation-request-form-inputs #fileInput',
  );
  const proofDocument = fileInput?.files[0] || null;

  // 파일을 base64로 변환_다운로드 되게
  let proofDocumentBase64 = null;
  if (proofDocument) {
    const reader = new FileReader();
    proofDocumentBase64 = await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(proofDocument);
    });
  }

  const updatedData = {
    abs_type: vacationType,
    abs_title:
      container.querySelector('.vacation-request-form-inputs #vacation-title')
        .value || currentAbsData.abs_title,
    abs_start_date:
      container.querySelector(
        '.vacation-request-form-inputs #vacation-start-date',
      ).value || currentAbsData.abs_start_date,
    abs_end_date:
      container.querySelector(
        '.vacation-request-form-inputs #vacation-end-date',
      ).value || currentAbsData.abs_end_date,
    abs_content:
      container.querySelector('.vacation-request-form-inputs #vacation-content')
        .value || currentAbsData.abs_content,
    abs_proof_document: proofDocument
      ? proofDocument.name
      : currentAbsData.abs_proof_document,
    abs_proof_document_base64:
      proofDocumentBase64 || currentAbsData.abs_proof_document_base64,
  };

  try {
    await update(absenceRef, updatedData); // absence 데이터 업데이트
    console.log('부재 데이터가 성공적으로 업데이트되었습니다.');
    return updatedData; // 업데이트된 데이터를 반환
  } catch (error) {
    console.error('부재 데이터 업데이트 중 오류 발생:', error);
    throw error;
  }
};

// 부재 삭제
export const deleteUserAbsence = async (userId, absenceId) => {
  const db = getDatabase();
  const absenceRef = ref(db, `absences/${userId}/${absenceId}`);

  try {
    await remove(absenceRef); // absence 데이터 삭제
    console.log('부재 데이터가 성공적으로 삭제되었습니다.');
    return true;
  } catch (error) {
    console.error('부재 데이터 삭제 중 오류 발생:', error);
    throw error;
  }
};
