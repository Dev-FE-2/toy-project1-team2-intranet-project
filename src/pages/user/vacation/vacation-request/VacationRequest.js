import './VacationRequest.css';
import { Button, VacationRequestForm, Modal } from '../../../../components';
import { validateVacationRequestInput } from '../../../../utils/validation';
import { USER_PATH } from '../../../../utils/constants';

export const RenderUserVacationRequest = async container => {
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
      if (validateVacationRequestInput(false)) {
        Modal('vacation-success', USER_PATH.VACATION);
      } else {
        Modal('vacation-fail');
      }
    },
  });
  buttonPosition.append(submitBtn);
};
