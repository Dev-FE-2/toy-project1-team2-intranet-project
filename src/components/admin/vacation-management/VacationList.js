import axios from 'axios';

import { Accordion } from '../../ui/accordion/Accordion';
import { Button } from '../../ui/button/Button';
import './VacationList.css';

export const RenderAdminVacationManagementList = async container => {
  container.innerHTML = `<div class="loading">휴가 정보를 가져오는 중입니다.</div>`;

  try {
    const [absencesResponse, usersResponse] = await Promise.all([
      axios.get('../../../../server/data/absences.json'),
      axios.get('../../../../server/data/users.json'),
    ]);

    const absences = absencesResponse.data;
    const users = usersResponse.data;

    const absenceUsersData = absences.map(absence => {
      const user = users.find(user => user.user_id === absence.user_id);
      return {
        ...absence,
        user_name: user.user_name,
        user_image: user.user_image,
        user_phone: user.user_phone,
        user_position: user.user_position,
      };
    });

    // 다운로드 버튼
    const downloadButton = new Button({
      text: '다운로드',
      color: 'white',
      shape: 'line',
      padding: 'var(--space-xsmall) var(--space-small)',
    });

    // 승인, 거부, 대기 버튼
    const renderButtons = status => {
      switch (status) {
        case '승인':
          return '';
        case '거부': {
          const cancelButton = new Button({
            text: '거부 취소',
            color: 'gray',
            shape: 'block',
            padding: 'var(--space-small) var(--space-large)',
          });

          return `
            <div class="approval-button-group">
              ${cancelButton.outerHTML}
            </div>
          `;
        }
        case '대기': {
          const approveButton = new Button({
            text: '승인하기',
            color: 'skyblue',
            shape: 'block',
            padding: 'var(--space-small) var(--space-large)',
          });

          const rejectButton = new Button({
            text: '거부하기',
            color: 'coral',
            shape: 'block',
            padding: 'var(--space-small) var(--space-large)',
          });

          return `
            <div class="approval-button-group">
              ${approveButton.outerHTML}
              ${rejectButton.outerHTML}
            </div>
          `;
        }
        default:
          return '';
      }
    };

    // 아코디언 헤더
    const renderHeader = item => `
      <header class="admin-vacation-info">
        <div class="admin-vacation-status-dot active"></div>
        <img src="${item.user_image}" alt="${item.user_name}" class="admin-vacation-avatar">
        <span class="admin-vacation-abs-type">${item.abs_type}</span>
        <span class="admin-vacation-name">${item.user_name}</span>
        <span class="admin-vacation-position">${item.user_position}</span>
        <span class="admin-vacation-phone">${item.user_phone}</span>
        <time class="admin-vacation-create-date">${item.abs_created_at}</time>
        <span class="admin-vacation-status status-${item.abs_status}">${item.abs_status}</span>
      </header>
    `;

    // 아코디언 컨텐츠
    const renderContent = (item, index) => `
      <article class="detail-content">
        <div class="detail-grid">
          <section class="detail-item">
            <h3 class="detail-label">휴가 제목</h3>
            <div class="detail-value">${item.abs_title}</div>
          </section>
          
          <div class="detail-item">
            <h3 class="detail-label">휴가 기간</h3>
            <div class="detail-value">
              <time class="date">${item.abs_start_date}</time>
              <span class="date-separator">~</span>
              <time class="date">${item.abs_end_date}</time>
            </div>
          </div>

          <section class="detail-item">
            <h3 class="detail-label">첨부 파일</h3>
            <div class="download-file">
              <p class="detail-value">FE_${item.user_name}_${item.abs_type}.pdf</p>
              ${downloadButton.outerHTML}
            </div>
          </section>

          <section class="detail-item detail-content-box">
            <h3 class="detail-label">휴가 내용</h3>
            <p class="detail-value content-box" data-index="${index}">${item.abs_content}</p>
          </section>
        </div>

        ${renderButtons(item.abs_status)}
      </article>
    `;

    // 아코디언 렌더링
    container.innerHTML = `
      <section class="admin-vacation-list-section">
        <div class="admin-vacation-list">
            ${Accordion({
              items: absenceUsersData,
              renderHeader,
              renderContent,
            })}
        </div>
      </section>
    `;
  } catch (error) {
    let errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data.message || errorMessage}`;
      } else if (error.request) {
        errorMessage = '서버로부터 응답을 받지 못했습니다.';
      }
    }

    container.innerHTML = `
      <div class="admin-vacation-section error">
        ${errorMessage}
      </div>
    `;
  }
};
