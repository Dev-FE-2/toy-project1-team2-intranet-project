import Router from '/src/routes/Router';
import { ADMIN_PATH, USER_PATH } from '../../utils/constants';
import { getItem } from '../../utils/storage';
import './NotFound.css';

export const RenderNotFound = container => {
  container.innerHTML = `
      <div class="error-container">
        <div class="error-inner">
          <h1>PAGE NOT FOUND</h1>
          <h4>
            페이지의 주소가 잘못 입력되었거나,<br />
            요청하신 페이지의 주소가 변경 혹은 삭제되어 찾을 수 없습니다.
          </h4>
          <button color="transparent" shape="line">홈으로</button>
        </div>
      </div>
  `;

  document.querySelector('button').addEventListener('click', () => {
    // SPA 방식으로 상태 유지하며 페이지 전환
    getItem('userRole') === 'admin'
      ? Router(ADMIN_PATH.HOME)
      : Router(USER_PATH.HOME);
    // or 브라우저 히스토리에 안 남기면서 페이지 새로고침함
    // const redirectPath = getItem('userRole') === 'admin' ? ADMIN_PATH.HOME : USER_PATH.HOME;
    // window.location.replace(redirectPath);
  });
};
