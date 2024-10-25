// edit-profile 유효성 검사 함수
const validInput = userPassword => {
  const inputs = {
    // 사용자 프로필
    phone:
      document.querySelector('.user-profile-inputs input#phone')?.value ?? '',
    password:
      document.querySelector('.user-profile-inputs input#password')?.value ??
      '',
    confirmPassword:
      document.querySelector('.user-profile-inputs input#confirm-password')
        ?.value ?? '',
    name:
      document.querySelector('.user-profile-inputs input#name')?.value ?? '',
    role:
      document.querySelector('.user-profile-inputs select#role')?.value ?? '',
    gender:
      document.querySelector('.user-profile-inputs select#gender')?.value ?? '',
    birthDate:
      document.querySelector('.user-profile-inputs input#birthDate')?.value ??
      '',
    email: document.getElementById('email')?.value ?? '',
    // 사용자 휴가/공가 신청 폼
    vcType:
      document.querySelector(
        '.vacation-request-form-inputs select#vacation-type',
      )?.value ?? '',
    vcTitle:
      document.querySelector(
        '.vacation-request-form-inputs input#vacation-title',
      )?.value ?? '',
    vcStart:
      document.querySelector(
        '.vacation-request-form-inputs input#vacation-start-date',
      )?.value ?? '',
    vcEnd:
      document.querySelector(
        '.vacation-request-form-inputs input#vacation-end-date',
      )?.value ?? '',
    vcContent:
      document.querySelector(
        '.vacation-request-form-inputs textarea#vacation-content',
      )?.value ?? '',
    vcProofFile:
      document.querySelector('.vacation-request-form-inputs input#fileInput')
        ?.files[0] ?? null,
  };

  // 프로필 수정 관련
  if (userPassword) {
    if (!inputs.phone.trim()) {
      alert('전화번호를 입력해주세요.');
      return false;
    }
    // 전화번호 형식 검사 (xxx-xxxx-xxxx)
    const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
    if (!phonePattern.test(inputs.phone)) {
      alert('전화번호 형식이 올바르지 않습니다. 형식: xxx-xxxx-xxxx');
      return false;
    }

    if (!inputs.password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return false;
    }
    if (inputs.password.length < 6) {
      alert('비밀번호는 6자리 이상이어야 합니다.');
      return false;
    }
    // 비밀번호가 사용자 것과 일치하지 않을 떄
    if (inputs.password !== userPassword) {
      alert('가입되지 않은 비밀번호입니다.');
      return false;
    }
    // 비밀번호 확인 검사
    if (inputs.password !== inputs.confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return false;
    }

    if (!inputs.name.trim()) {
      alert('이름을 입력해주세요.');
      return false;
    }

    if (!inputs.role) {
      alert('역할을 선택해주세요.');
      return false;
    }

    if (!inputs.gender) {
      alert('성별을 선택해주세요.');
      return false;
    }

    if (!inputs.birthDate) {
      alert('생년월일을 입력해주세요.');
      return false;
    }

    if (!inputs.email.trim()) {
      alert('이메일을 입력해주세요.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return false;
    }
  } else {
    //폼 관련
    if (!inputs.vcType) {
      alert('부재 종류를 선택해주세요.');
      return false;
    }
    if (!inputs.vcTitle.trim()) {
      alert('부재 제목을 입력해주세요.');
      return false;
    }
    if (!inputs.vcStart || !inputs.vcEnd) {
      alert('시작일과 종료일을 모두 입력해주세요.');
      return false;
    }
    if (new Date(inputs.vcStart) > new Date(inputs.vcEnd)) {
      alert('종료일이 시작일보다 빠를 수 없습니다.');
      return false;
    }
    if (!inputs.vcContent.trim()) {
      alert('부재 사유를 입력해주세요.');
      return false;
    }
    if (inputs.vcContent.length > 2000) {
      alert('부재 사유는 최대 2,000자로 입력해주세요.');
      return false;
    }
  }
  return true;
};

export { validInput }; // 함수 내보내기
