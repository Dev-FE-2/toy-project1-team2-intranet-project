import { ApiClient } from '../../../../apis/ApiClient';
import { Button } from '../../../../components';
import { Accordion } from '../../../../components/ui/accordion/Accordion';
import './MemberDetail.css';

const MEMBER_INFORMATION_URL = '../../../../../server/data/users.json';
const MEMBER_VACATION_URL = '../../../../../server/data/absences.json';

export default async function RenderAdminMemberDetail(container, memberId) {
  const handleMemberInformation = async () => {
    try {
      const data = await ApiClient.get(MEMBER_INFORMATION_URL);
      return data.data.find(member => member.user_id === memberId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMemberDetailVacation = async () => {
    try {
      const data = await ApiClient.get(MEMBER_VACATION_URL);
      const filterData = data.data.find(member => member.user_id === memberId);
      return [
        {
          ...filterData,
          member_name: memberDetail.user_name,
          member_postition: memberDetail.user_position,
          member_phone: memberDetail.user_phone,
        },
      ];
    } catch (e) {
      console.error(e);
    }
  };

  const memberDetail = await handleMemberInformation();
  const memberVationDetail = await handleMemberDetailVacation();

  const downloadButton = new Button({
    text: '다운로드',
    color: 'white',
    shape: 'line',

    padding: 'var(--space-xsmall) var(--space-xsmall)',
  });

  const renderHeader = () => /*html*/ `
  <header class="member-detail-info">
    <div class="member-detail-status-dot active">
    </div>
    <img src="${memberDetail.user_image}" alt="${memberDetail.user_name}" class="admin-vacation-avatar">
    <span >${memberDetail.user_position}</span>
    <span >${memberDetail.user_birthday.replace('-', '.')}</span>
    <span >${memberDetail.user_name}</span>
    <span >${memberDetail.user_phone}</span>
    <span >${memberDetail.user_sex}</span>
    <span >${memberDetail.user_email}</span>
  </header>
`;

  const renderContent = (value, index) => {
    return `
          <article class="member-detail-content">
          <div class="member-detail-grid">
            <section class="member-detail-item">
              <h3 class="member-detail-label">휴가 제목</h3>
              <div class="member-detail-value">${value.abs_title}</div>
            </section>            
            <div class="member-detail-item">
              <h3 class="member-detail-label">휴가 기간</h3>
              <div class="member-detail-value">
                <time class="date">${value.abs_start_date}</time>
                <span class="date-separator">~</span>
                <time class="date">${value.abs_end_date}</time>
              </div>
            </div>
    
            <section class="member-detail-item">
              <h3 class="member-detail-label">첨부 파일</h3>
              <div class="member-download-file">
                <p class="member-detail-value">FE_${value.abs_type}_${value.abs_type}.pdf</p>
                ${downloadButton.outerHTML}
              </div>
            </section>
            <section class="member-detail-item member-detail-content-box">
              <h3 class="member-detail-label">휴가 내용</h3>
              <p class="member-detail-value content-box" data-index="${index}">${value.abs_content}</p>
            </section>
          </div>          
        </article>
        `;
  };
  container.innerHTML = /*html*/ `
    <div class="member-detail-container">    
      <h1>직원 상세</h1>
      <div class="member-detail-wapper">
        <div class="member-detail-items">
          <div class="profile-top">
            <img src="${memberDetail.user_image}" alt="프로필 이미지" class="profile-img-item"/>          
          </div>       
          <div class="profile-information">         
            <span>직책:${memberDetail.user_position}</span>
            <span>생년월일:${memberDetail.user_birthday.replace('-', '.')}</span>                
            <span>이름:${memberDetail.user_name}</span>
            <span>전화번호:${memberDetail.user_phone}</span>                 
            <span>성별:${memberDetail.user_sex}</span>
            <span>이메일:${memberDetail.user_email}</span>        
          </div>
        </div>      
        <div class="member-bottom">
          <div class="member-bottom-line"></div>
        </div>    
        <div class="member-detail-footer">
          <h1>부재 신청 내역</h1>
          <div class="member-detail-footer-item">
          <div class="member-detail-item-wrapper">            
             <div class="member-detail-list">               
               ${Accordion({
                 items: memberVationDetail,
                 renderHeader,
                 renderContent,
               })}
              
             </div>
           </div>
        </div>     
        </div>            
          
      </div>
    </div>
  `;
}
