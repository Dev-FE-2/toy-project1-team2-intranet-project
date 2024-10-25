import './EditProfileForm.css';

export const EditProfileForm = () => {
  return `
      <fieldset class="user-profile-inputs">

        <div class="input-box">
          <label class="user-input" for="role">직책</label>
           <select class="input-select" id="role">
            <option value="">선택하세요</option>
            <option value="student">수강생</option>
            <option value="manager">매니저</option>
          </select>
        </div>
        
        <div class="input-box">
          <label class="user-input" for="name">이름</label>
          <input class="input-field" type="text" id="name">
        </div>
        
        <div class="input-box">
          <label class="user-input" for="gender">성별</label>
          <select class="input-select" id="gender">
            <option value="">선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        
        <div class="input-box">
          <label class="user-input" for="birthDate">생년월일</label>
          <input class="input-field" type="date" id="birthDate">
        </div>
        
        <div class="input-box">
          <label class="user-input" for="phone">전화번호</label>
          <input class="input-field" type="text" id="phone">
        </div>
        
        <div class="input-box">
          <label class="user-input" for="email">이메일</label>
          <input class="input-field" type="text" id="email">
        </div>
        
       <div class="input-box">
        <label class="user-input" for="password">비밀번호</label>
        <input class="input-field" type="password" id="password">
        <span class="material-symbols-rounded" id="toggle-password">visibility_off</span>
      </div>

      <div class="input-box">
        <label class="user-input" for="confirm-password">비밀번호 확인</label>
        <input class="input-field" type="password" id="confirm-password">
        <span class="material-symbols-rounded" id="toggle-confirm-password">visibility_off</span>
      </div>

      </fieldset>
    `;
};
