import './VacationRequest.css';
import {
  Button,
  validInput,
  VacationRequestForm,
} from '../../../../components';

export const RenderUserVacationRequest = async (container, isVacationPage) => {
  // 기본 HTML 구조 설정
  container.innerHTML = `
    <div class="vacation-request-title">부재 신청</div>
      <div class="vacation-request-form">
      </div>
    </div>
  `;

  const formComponent = VacationRequestForm();

  const formContainer = container.querySelector('.vacation-request-form');
  formComponent.renderForm(formContainer);

  // 버튼 추가
  const buttonPosition = container.querySelector('.vacation-request-form');
  const submitBtn = Button({
    className: 'vacation-request-submit-btn',
    text: '부재 신청하기',
    color: 'skyblue',
    shape: 'block',
    padding: 'var(--space-medium)',
    fontWeight: 700,
    onClick: e => {
      e.preventDefault();
      if (validInput()) {
        alert('모든 입력이 유효합니다.');
        // 추가적인 작업 수행 가능
      }
    },
  });
  buttonPosition.append(submitBtn);

  // proofFile 이벤트 리스너 추가
  attachProofFileEvents(container);

  if (isVacationPage) {
    console.log('휴가/공가 관리 페이지');
  }
};

const attachProofFileEvents = container => {
  const fileInput = container.querySelector('#fileInput');
  const buttonPosition = container.querySelector('.input-box.proof-file'); // 업로드 버튼 선택

  const proofFileUploadBtn = Button({
    className: 'proof-file-upload-btn',
    text: '첨부파일 업로드',
    color: 'transparent',
    shape: 'line',
    padding: 'var(--space-small)',
    onClick: e => {
      e.preventDefault();
      fileInput.click();
    },
  });

  buttonPosition.append(proofFileUploadBtn);

  fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    const filePreviewContainer = container.querySelector('.proof-file-preview'); // 파일 제목을 표시할 요소
    filePreviewContainer.innerHTML = ''; // 기존 파일 목록을 초기화

    if (files.length > 0) {
      const file = files[0];

      const reader = new FileReader();

      reader.onload = event => {
        const filePreview = document.createElement('div');
        filePreview.classList.add('file-title');
        filePreview.textContent = file.name; // 파일 이름 표시

        // 파일 제목 클릭 시 다운로드
        filePreview.addEventListener('click', () => {
          const link = document.createElement('a');
          link.href = event.target.result; // base64 데이터 URL
          link.download = file.name; // 파일 이름으로 다운로드
          link.click(); // 링크 클릭하여 다운로드
        });

        filePreviewContainer.appendChild(filePreview);
      };

      // 파일 읽기 시작
      reader.readAsDataURL(file); // base64로 파일을 읽음
    } else {
      alert('파일을 선택해 주세요.');
    }
  });
};
