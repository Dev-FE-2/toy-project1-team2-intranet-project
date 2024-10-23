import { ApiClient } from '../../../../apis/ApiClient';
import Button from '../../../../components/ui/button/Button';
import './MemberManagement.css';

export const RenderAdminMemberManagement = async container => {
  const deleteButton = Button({
    width: 80,
    text: '삭제',
    color: 'var(--color-coral)',
  });
  const uploadButton = Button({
    width: 80,
    text: '업로드',
    color: 'var(--color-skyblue-light)',
  });

  const USER_URL = '../../../../../server/data/users.json';
  async function fetchUsers() {
    try {
      const userData = await ApiClient(USER_URL);
      return userData;
    } catch (e) {
      console.error(e);
    }
  }

  const users = await fetchUsers();

  const renderUserList = users => {
    return users
      .map(user => {
        const detailButton = Button({
          width: 100,
          text: '상세보기',
          color: 'var(--color-coral)',
          id: user.user_id,
        });
        return `
        <div class="user-wrapper">
          <label>
            <input type="checkbox" id=${user.user_id}>
            <span class="custom-checkbox">
            </span>        
          </label>
          <div class="user-item">
            <div class="circle1">              
            </div>
            <div class="circle">              
            </div>
            <div class="user-list">
              <p>${user.user_position}</p>
            </div>
            <div class="user-list">
              <p>${user.user_name}</p>
            </div>
            <div class="user-list" >
              <p>${user.user_email}</p>
            </div>
            <div class="user-list">
              <p>${user.user_phone}</p>
            </div>
            <div class="user-list">
              ${detailButton.outerHTML}
             </div>
          </div>
        </div>
      `;
      })
      .join('');
  };

  const userList = renderUserList(users.data.data);
  container.innerHTML = `
    <div class="user-container">
      <div class="user-top">
        <h1>직원 목록</h1>    
        <div class="user-update">
          <select>
            <option>수강생</option>
            <option>매니저</option>
          </select>
          <input type="text" placeholder="Search"/>
          <button>
            <span class="material-symbols-rounded">
              search
            </span> 
          </button>
        </div>
      </div>
      <section class="user-section">
          ${userList}
      </section>
    </div>
  `;
  const userTop = container.querySelector('.user-update');
  userTop.appendChild(deleteButton);
  userTop.appendChild(uploadButton);
  fetchUsers();
};
