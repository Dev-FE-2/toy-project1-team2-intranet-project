import './VacationRequestForm.css';
export const VacationRequestForm = () => {
  const form = `
      <fieldset class="vacation-request-form-inputs">

        <div class="input-box">
            <label class="vacation-input" for="vacation-type">부재 종류</label>
            <select class="input-select" id="vacation-type">
              <option value="">선택하세요</option>
              <option value="officialLeave">공가</option>
              <option value="sickLeave">병가</option>
              <option value="annualLeave">휴가</option>
            </select>
          </div>
        
        <div class="input-box">
          <label class="vacation-input" for="vacation-title">부재 제목</label>
          <input class="input-field" type="text" id="vacation-title" placeholder="부재 제목을 입력해주세요.">
        </div>
        
        <div class="input-box">
          <label class="vacation-input" for="vacation-start-date">시작일</label>
          <input class="input-field" type="date" id="vacation-start-date">
        </div>

        <div class="input-box">
          <label class="vacation-input" for="vacation-end-date">종료일</label>
          <input class="input-field" type="date" id="vacation-end-date">
        </div>

        <div class="input-box" id="vacation-content">
          <label class="vacation-input" for="vacation-content">부재 사유</label>
          <textarea class="input-field" id="vacation-content" placeholder="부재 사유를 입력해주세요."></textarea> 
        </div>
        
        <div class="input-box proof-file">
          <label class="vacation-input" for="vacation-proof-document">첨부 파일</label>
          <div class="proof-file-preview"></div>
          <input type="file" id="fileInput" accept=".pdf, .zip, .jpg, .png"/> 
        </div>

      </fieldset>
      `;

  // vacation-content 줄바꿈 발생하면 자동 높이 조정
  const handleResizeHeight = textarea => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px'; // 스크롤 높이에 맞춰 조정
  };
  // 폼을 DOM에 삽입, textarea에 이벤트리스너 추가
  const renderForm = container => {
    container.innerHTML = form;
    const textarea = container.querySelector('.input-box #vacation-content');
    textarea.addEventListener('input', () => handleResizeHeight(textarea));
  };

  return { renderForm }; //객체로 반환
};
