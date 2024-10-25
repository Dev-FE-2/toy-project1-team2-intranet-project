import './ProfileImage.css';
import { Button } from '../../../components';
import {
  deleteProfileImage,
  uploadProfileImg,
} from '../../../utils/handleProfileImg';

export const ProfileImage = () => {
  return `
    <section class="user-profileImg-container">
       <div class="profileImg-box">
        <div class="real-profileImg"></div>
        <div class="inside-circle" id="profileImage">
          <span class="circle-text">Upload</span>
          <span class="circle-text">Your</span>
          <span class="circle-text">Profile</span>
        </div>
        <p class="profile-description">
          프로필 이미지를 업로드 해주세요!
        </p>
        <p class="profile-description-constraint">
          (단, jpg/png/jpeg 확장자 파일만 적용됩니다.)
        </p>
      </div>
      <div class="user-profileImg-button-container">
      <input type="file" id="fileInput" accept="image/jpeg, image/png"/>
    </section>
  `;
};

export const attachProfileImageEvents = container => {
  const fileInput = container.querySelector('#fileInput');
  const profileImgPosition = container.querySelector('.real-profileImg');
  const buttonPosition = container.querySelector(
    '.user-profileImg-button-container',
  ); // 업로드 버튼 선택

  const imgUploadBtn = Button({
    className: 'img-upload-btn',
    text: '사진 선택하기',
    color: 'transparent',
    shape: 'line',
    padding: 'var(--space-small)',
    onClick: e => {
      e.preventDefault();
      fileInput.click();
    },
  });
  const imgDeleteBtn = Button({
    className: 'img-delete-btn',
    text: '기본 이미지로 변경',
    color: 'white',
    shape: 'line',
    padding: 'var(--space-small)',
    onClick: e => {
      e.preventDefault();
      // 프로필 사진 삭제
      deleteProfileImage(profileImgPosition);
    },
  });

  buttonPosition.append(imgUploadBtn);
  buttonPosition.append(imgDeleteBtn);

  // Change event 리스너를 설정
  fileInput.addEventListener('change', () => {
    const files = fileInput.files; // 선택한 파일들 가져오기
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader(); // FileReader 객체 생성

      // 파일 읽기가 완료되었을 때 실행되는 이벤트
      reader.onload = event => {
        // 선택된 파일의 데이터 URL을 로컬 스토리지에 저장, 사용
        // 프로필 사진 삭제 수정 && 업로드
        uploadProfileImg(profileImgPosition, event.target.result);
      };

      // 파일 읽기 시작
      reader.readAsDataURL(file);
    } else {
      alert('파일을 선택해 주세요.');
    }
  });
};
