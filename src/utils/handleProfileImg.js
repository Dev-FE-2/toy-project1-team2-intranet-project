import { setItem, getItem, removeItem } from './storage';

export const deleteProfileImage = position => {
  if (getItem('userProfileImg')) removeItem('userProfileImg'); //기존 프로필 이미지가 있으면 삭제
  setItem('userProfileImg', '/assets/imgs/profile/profile_null.jpg'); // 기본 이미지 저장
  position.style.backgroundImage = `url(/assets/imgs/profile/profile_null.jpg)`; // 기본 이미지 적용

  // 커스텀 이벤트 발생시킴
  const event = new Event('profileImageUpdated');
  window.dispatchEvent(event);
};

export const uploadProfileImg = (position, base64ImageData) => {
  if (getItem('userProfileImg')) removeItem('userProfileImg'); //기존 프로필 이미지가 있으면 삭제
  setItem('userProfileImg', base64ImageData); // 새 이미지 저장
  position.style.backgroundImage = `url(${base64ImageData})`; // 새 이미지 적용

  // 커스텀 이벤트 발생시킴
  const event = new Event('profileImageUpdated');
  window.dispatchEvent(event);
};

//프사 변경되면 반영함
export const applyProfileImage = position => {
  const userProfileImg = getItem('userProfileImg');
  if (userProfileImg) {
    position.style.backgroundImage = `url(${userProfileImg})`;
  } else {
    position.style.backgroundImage = `url(/assets/imgs/profile/profile_null.jpg)`;
  }
};

// 프사 업데이트 감지해 applyProfileImage 실행시킴
export const listenForProfileImageUpdate = position => {
  window.addEventListener('profileImageUpdated', () => {
    applyProfileImage(position);
  });
};
