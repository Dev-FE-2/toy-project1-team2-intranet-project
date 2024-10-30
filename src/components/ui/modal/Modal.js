import { adminModalContent } from './admin/adminModal';
import './Modal.css';
import { userModalContent } from './user/userModal';
import { getUserIdName } from '../../../../server/api/user';
import { saveTimePunchData } from '../../../../server/api/user';
import { noticeAPI } from '../../../../server/api/admin';
import navigate from '../../../utils/navigation';
import { ADMIN_PATH } from '../../../utils/constants';

function createModalElement() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'none';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const closeButton = document.createElement('span');
  closeButton.className = 'close-button';
  closeButton.innerHTML = '&times;';
  closeButton.onclick = () => closeModal(modal);

  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);

  modal.onclick = event => {
    if (event.target === modal) {
      closeModal(modal);
    }
  };

  return { modal, modalContent };
}

// USER
function isUserAction(actionType) {
  return [
    'punch-in',
    'punch-out',
    'break-out',
    'break-in',
    'vacation',
    'punch-in-success',
    'punch-out-success',
    'break-out-success',
    'break-in-success',
    'edit-profile-success',
    'vacation-success',
    'punch-in-fail',
    'punch-out-fail',
    'break-out-fail',
    'break-in-fail',
    'vacation-fail',
    'edit-profile-fail',
  ].includes(actionType);
}

// ADMIN
function isAdminAction(actionType) {
  return [
    'employee-delete',
    'notice-delete',
    'vacation-permit',
    'vacation-permit-cancle',
    'vacation-reject',
    'vacation-reject-cancle',
    'employee-delete-success',
    'notice-delete-success',
    'vacation-permit-success',
    'vacation-permit-cancle-success',
    'vacation-reject-success',
    'vacation-reject-cancle-success',
    'notice-upload-success',
    'employee-registration-success',
    'vacation-permit-fail',
    'vacation-permit-cancle-fail',
    'vacation-reject-fail',
    'notice-edit-success',
    'vacation-reject-cancle-fail',
    'notice-upload-fail',
    'employee-registration-fail',
  ].includes(actionType);
}

function closeModal(modal) {
  if (modal.parentNode) {
    // modal이 DOM에 존재하는지 확인
    modal.style.display = 'none';
    document.body.removeChild(modal);
  }
}

export async function Modal(type, options = {}) {
  const { modal, modalContent } = createModalElement();
  document.body.appendChild(modal);

  modalContent.innerHTML = ''; // 이전 내용 초기화

  let modalInstance = {
    userId: null,
    userName: null,
    ...options,
    close: () => closeModal(modal),
    handleConfirm: async actionType => {
      modalContent.innerHTML = ''; // 내용 초기화

      try {
        // actionType에 따라 적절한 모달 콘텐츠 호출
        switch (actionType) {
          case 'punch-in':
            await saveTimePunchData(
              modalInstance.userId,
              'punch-in',
              modalInstance.userName,
            );
            modalContent.appendChild(
              userModalContent('punch-in-success', modalInstance),
            );
            break;

          case 'punch-out':
            await saveTimePunchData(
              modalInstance.userId,
              'punch-out',
              modalInstance.userName,
            );
            modalContent.appendChild(
              userModalContent('punch-out-success', modalInstance),
            );
            break;

          case 'break-out':
            await saveTimePunchData(
              modalInstance.userId,
              'break-out',
              modalInstance.userName,
            );
            modalContent.appendChild(
              userModalContent('break-out-success', modalInstance),
            );
            break;

          case 'break-in':
            await saveTimePunchData(
              modalInstance.userId,
              'break-in',
              modalInstance.userName,
            );
            modalContent.appendChild(
              userModalContent('break-in-success', modalInstance),
            );
            break;

          case 'notice-delete':
            try {
              const postId = modalInstance.postId;
              const result = await noticeAPI.deleteNotice(postId);
              if (result.success) {
                modalContent.appendChild(
                  adminModalContent('notice-delete-success', modalInstance),
                );
                navigate(ADMIN_PATH.NOTICE);
              }
            } catch (error) {
              console.error('공지사항 삭제 중 오류 발생:', error);
              modalContent.appendChild(
                adminModalContent('notice-upload-fail', modalInstance),
              );
            }
            break;

          default:
            console.log('잘못된 요청 처리:', actionType);
            if (isUserAction(actionType)) {
              modalContent.appendChild(
                userModalContent(actionType, modalInstance),
              );
            } else if (isAdminAction(actionType)) {
              modalContent.appendChild(
                adminModalContent(actionType, modalInstance),
              );
            } else {
              modalContent.innerHTML = '<p>잘못된 요청입니다.</p>';
            }
            break;
        }
      } catch (error) {
        console.error('데이터 저장 중 오류 발생:', error);
        modalContent.innerHTML =
          '<p>데이터 저장에 실패했습니다. 다시 시도해 주세요.</p>';
      }
    },
    handleCancel: () => {
      closeModal(modal); // 모달을 닫습니다.
    },
  };

  // 현재 로그인한 사용자 정보 가져오기
  try {
    const userData = await getUserIdName(); // 사용자 정보 가져오기
    modalInstance.userId = userData.id; // 사용자 ID 설정
    modalInstance.userName = userData.name; // 사용자 이름 설정
  } catch (error) {
    console.error('사용자 정보 오류:', error); // 에러 로그 출력
    modalContent.innerHTML = '<p>사용자 정보를 가져오지 못했습니다.</p>';
    modal.style.display = 'flex'; // 에러 발생 시 모달 열기
    return; // 더 이상 진행하지 않음
  }

  // 모달 타입에 따라 내용 추가
  switch (type) {
    case 'punch-in':
    case 'punch-out':
    case 'break-out':
    case 'break-in':
    case 'vacation':
      modalContent.appendChild(userModalContent(type, modalInstance));
      break;
    case 'employee-delete':
    case 'notice-delete':
    case 'vacation-permit':
    case 'vacation-permit-cancle':
    case 'vacation-reject':
    case 'vacation-reject-cancle':
      modalContent.appendChild(adminModalContent(type, modalInstance));
      break;
    case 'punch-in-success':
    case 'punch-out-success':
    case 'break-out-success':
    case 'break-in-success':
    case 'edit-profile-success':
    case 'vacation-success':
      modalContent.appendChild(userModalContent(type, modalInstance));
      break;
    case 'employee-delete-success':
    case 'notice-delete-success':
    case 'vacation-permit-success':
    case 'vacation-permit-cancle-success':
    case 'vacation-reject-success':
    case 'vacation-reject-cancle-success':
    case 'notice-edit-success':
    case 'notice-upload-success':
    case 'employee-registration-success':
      modalContent.appendChild(adminModalContent(type, modalInstance));
      break;
    case 'punch-in-fail':
    case 'punch-out-fail':
    case 'break-out-fail':
    case 'break-in-fail':
    case 'vacation-fail':
    case 'edit-profile-fail':
      modalContent.appendChild(userModalContent(type, modalInstance));
      break;
    case 'vacation-permit-fail':
    case 'vacation-permit-cancle-fail':
    case 'vacation-reject-fail':
    case 'vacation-reject-cancle-fail':
    case 'notice-upload-fail':
    case 'employee-registration-fail':
      modalContent.appendChild(adminModalContent(type, modalInstance));
      break;
    default:
      modalContent.innerHTML =
        '<p class="error-request-message">잘못된 요청입니다.</p>';
      break;
  }
  modal.style.display = 'flex'; // 모달 열기
}
