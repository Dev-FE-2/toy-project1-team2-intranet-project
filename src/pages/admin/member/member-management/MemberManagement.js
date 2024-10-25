import { ApiClient } from '../../../../apis/apiClient';
import { Button } from '../../../../components';
import { Pagenation } from '../../../../components/common/pagenation/Pagenation';
import './MemberManagement.css';

export const RenderAdminMemberManagement = async container => {
  let currentPage = 1; // 현재 페이지
  const itemsPerPage = 6; // 페이지당 보여줄 아이템 수
  let searchValue = ''; // 검색어 저장
  let positionValue = ''; //직급
  let filteredUsers = '';

  const deleteButton = Button({
    width: 80,
    text: '삭제',
    color: 'coral',
    shape: 'block',
  });
  const uploadButton = Button({
    width: 80,
    text: '업로드',
    color: 'skyblue-light',
    shape: 'block',
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

  // 데이터를 페이지와 검색어에 따라 필터링하고 페이지네이션 적용
  const paginateUsers = (users, page, itemsPerPage) => {
    // 사용자 필터링 조건
    filteredUsers = users.filter(user => {
      const matchesPosition =
        positionValue === '전체' || user.user_position.includes(positionValue);
      const matchesSearch = user.user_name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      return matchesPosition && matchesSearch; // 두 조건 모두 만족해야 함
    });
    // 페이지네이션 적용
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  // 페이지 변경 시 사용자 목록을 업데이트하는 함수
  const updateUserList = page => {
    const paginatedUsers = paginateUsers(users.data, page, itemsPerPage);
    const userSection = container.querySelector('.user-section');

    if (paginatedUsers.length === 0) {
      userSection.innerHTML = '<p class="search_no_data">데이터가 없습니다</p>';
    } else {
      const userList = renderUserList(paginatedUsers);
      userSection.innerHTML = userList;
    }
  };

  // 초기 렌더링
  const initialUsers = paginateUsers(users.data, currentPage, itemsPerPage);
  const userList = renderUserList(initialUsers);
  function renderUserList(users) {
    return users
      .map(user => {
        const detailButton = Button({
          width: 150,
          text: '상세보기',
          color: 'skyblue',
          id: user.user_id,
          shape: 'block',
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
              <img src="${user.user_image}" alt="프로필 이미지"/>        
            </div>
            <div class="user-list">
              <p>${user.user_position}</p>
              <p>${user.user_name}</p>
              <p>${user.user_email}</p>
              <p>${user.user_phone}</p>
              ${detailButton.outerHTML}
            </div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  container.innerHTML = `
    <div class="user-container">
      <div class="user-top">
        <h1>직원 목록</h1>    
        <div class="user-update">
          <select class="postion-select">
            <option value="전체">전체</option>
            <option value="수강생">수강생</option>
            <option value="매니저">매니저</option>
          </select>
          <input type="text" placeholder="Search" class="search"/>
          <button class="search-icon">
            <span class="material-symbols-rounded">
              search
            </span> 
          </button>
        </div>
      </div>
      <section class="user-section">
          ${userList}
      </section>
      <div class="pagination">
      
      </div>
    </div>
  `;

  const paginationContainer = Pagenation(
    users.data.length,
    itemsPerPage,
    currentPage,
    page => {
      currentPage = page;
      updateUserList(page);
    },
  );

  container.querySelector('.pagination').appendChild(paginationContainer);

  const userTop = container.querySelector('.user-update');
  userTop.appendChild(deleteButton);
  userTop.appendChild(uploadButton);

  const selectElement = document.querySelector('.postion-select');

  selectElement.addEventListener('change', function () {
    const selectedValue = selectElement.value; // 선택된 옵션의 값
    positionValue = selectedValue;
  });

  //select
  selectElement.addEventListener('change', function () {
    // 선택된 직급에 맞춰 첫 번째 페이지로 이동
    currentPage = 1;

    updateUserList(currentPage);

    const newPaginationContainer = Pagenation(
      filteredUsers.length,
      itemsPerPage,
      currentPage,
      page => {
        currentPage = page;
        updateUserList(page);
      },
    );
    container.querySelector('.pagination').innerHTML = ''; // 기존 페이지네이션 제거
    container.querySelector('.pagination').appendChild(newPaginationContainer);
  });

  const searchButton = document.querySelector('.search-icon');

  // 검색 버튼 클릭 이벤트
  searchButton.addEventListener('click', () => {
    searchValue = document.querySelector('.search').value.trim().toLowerCase(); // 검색어 업데이트

    // 검색 결과에 따라 첫 번째 페이지로 이동하여 목록 업데이트
    currentPage = 1;
    updateUserList(currentPage);

    const newPaginationContainer = Pagenation(
      filteredUsers.length,
      itemsPerPage,
      currentPage,
      page => {
        currentPage = page;
        updateUserList(page);
      },
    );
    container.querySelector('.pagination').innerHTML = ''; // 기존 페이지네이션 제거
    container.querySelector('.pagination').appendChild(newPaginationContainer);
  });

  updateUserList(currentPage); // 검색 결과에 따른 사용자 목록 업데이트
};
