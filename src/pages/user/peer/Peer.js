import './Peer.css';
import { setupSearch } from '../../../components/user/peer-list/PeerList';
import axios from 'axios';


export const RenderUserPeer = async container => {
  container.innerHTML = `
    <div class="peer-header">
      <p class="peer-title">여러분들의 동료 수강생 목록입니다.</p>
      <div class="search-bar">
        <input type="text" placeholder="Search" id="searchInput">
        <span class="material-symbols-rounded" id="searchIcon">search</span>
      </div>
    </div>
    <div class="peer-box"></div>
  `;

  let users = []; // 사용자 데이터를 담을 배열
  let currentIndex = 0;
  const initialItems = 15; // 처음 보여줄 항목 수
  const itemsPerPage = 5; // 스크롤 시 추가로 불러올 항목 수
  let filteredUsers = []; // 필터링된 사용자 목록

  const renderUsers = (container, startIndex, endIndex) => {
    const userMarkup = filteredUsers
      .slice(startIndex, endIndex)
      .map(
        user => `
    <div class="peer-frame">
      <div class="image-circle">
        <img src='/assets/imgs/profile/profile_null.jpg'/>
      </div>
      <p class="peer-name">${user.user_name}</p>
      <p class="peer-email">${user.user_email}</p>
    </div>
    `,
      )
      .join('');

    container.innerHTML += userMarkup;
  };

  const peerBox = container.querySelector('.peer-box');
  const jsonFilePath = '../../server/data/users.json';

  // 사용자 데이터 가져오기
  const fetchUserData = async () => {
    try {
      const response = await axios.get('../../server/data/users.json');
      users = response.data;
      filteredUsers = users;

      // 초기 사용자 렌더링
      renderUsers(peerBox, currentIndex, initialItems);
      currentIndex += initialItems;

      // 스크롤 이벤트
      peerBox.addEventListener('scroll', () => {
        if (peerBox.scrollTop + peerBox.clientHeight >= peerBox.scrollHeight) {
          // 5개씩 추가로 불러오기
          if (currentIndex < filteredUsers.length) {
            renderUsers(peerBox, currentIndex, currentIndex + itemsPerPage);
            currentIndex += itemsPerPage;
          }
        }
      });
    } catch (error) {
      console.error('사용자 데이터를 가져오는 중 오류 발생 ! :', error);
    }
  };

  // 사용자 데이터 가져오기 후 검색 기능 설정
  await fetchUserData();

  // 검색 기능 설정
  setupSearch(
    container,
    peerBox,
    users,
    renderUsers,
    initialItems,
    newFilteredUsers => {
      filteredUsers = newFilteredUsers;
    },
  );
};
