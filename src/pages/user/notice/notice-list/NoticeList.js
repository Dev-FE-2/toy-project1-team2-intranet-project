import axios from 'axios';
import { RenderNoticeItem } from '../../../../components';
import { getItem } from '../../../../utils/storage';
import navigate from '../../../../utils/navigation';
import './NoticeList.css';

export const RenderUserNoticeList = async container => {
  try {
    const response = await axios.get('../../server/data/company_posts.json');
    let posts = response.data.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
    ); //업데이트 일자 기준 내림차순 정렬

    const bcName = getItem('userBCName');

    const renderNoticeItems = filteredPosts => {
      return filteredPosts
        .map(
          post => `
          <div class="notice-item-container" id="notice-${post.post_id}" post-id="${post.post_id}"></div> 
        `,
        )
        .join('');
    };

    container.innerHTML = `
      <header class="notice-header">
        <div class="explain"><span class="strong">${bcName}</span>의 공지목록입니다.</div> 
        <div class="search">
          <input type="text" class="search-input" placeholder="Search"/>
          <span class="material-symbols-rounded">search</span> 
        </div>
      </header>
      <div class="notice-list">
        ${renderNoticeItems(posts)}
      </div>
    `;

    //notice-item-container클릭시 notice-detail 페이지로 이동하게 함
    //모든 notice-item-container에 클릭 이벤트 핸들러 연결함
    const attachClickHandlersToNotices = () => {
      const noticeItems = document.querySelectorAll('.notice-item-container');
      noticeItems.forEach(item => {
        item.addEventListener('click', () => {
          const postId = item.getAttribute('post-id');
          navigate(`/notice/${postId}`);
        });
      });
    };

    // 필터링 결과에 따라 DOM 업데이트할 함수
    const updateNotices = filteredPosts => {
      const noticeList = document.querySelector('.notice-list');
      if (filteredPosts.length === 0) {
        //검색 결과 없으면
        noticeList.innerHTML = `
         <div class="notice-filter-error-message">찾으시는 결과가 없습니다.</div>
        `;
      } else {
        noticeList.innerHTML = renderNoticeItems(filteredPosts);
        filteredPosts.forEach(post => {
          const postContainer = document.getElementById(
            `notice-${post.post_id}`,
          );
          if (postContainer) {
            //해당 id를 가진 post가 있으면
            RenderNoticeItem(postContainer, post); //각 공지 렌더링
          }
        });
      }
      attachClickHandlersToNotices();
    };

    // 검색 함수
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', e => {
      const searchTerm = e.target.value.toLowerCase(); //소문자로 맞춰서 검색할 거임
      const filteredPosts = posts.filter(post => {
        const titleMatch = post.post_title.toLowerCase().includes(searchTerm);
        const descriptionMatch = post.post_description
          .toLowerCase()
          .includes(searchTerm);
        const dateMatch = new Date(post.updated_at)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchTerm);
        return titleMatch || descriptionMatch || dateMatch;
      }); //post_title, post_description, updated_at 중 하나라도 검색한 거랑 같은 post들 반환

      //검색 결과 업데이트에 따라 필터링된 공지 렌더링
      updateNotices(filteredPosts);
    });

    updateNotices(posts); //처음엔 전체 공지 렌더링
  } catch (e) {
    console.error('공지를 가져오는 과정에서 에러가 발생했습니다:', e);
  }
};
