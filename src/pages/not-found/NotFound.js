import route from '/src/routes/Router';
import { getUserRole } from '../../utils/storage';
import './NotFound.css';

export const RenderNotFound = container => {
  container.innerHTML = `
      <div class="error-404__container">
        <div class="error-404__inner">
          <h1>PAGE NOT FOUND</h1>
          <h4>
            페이지의 주소가 잘못 입력되었거나,<br />
            요청하신 페이지의 주소가 변경 혹은 삭제되어 찾을 수 없습니다.
          </h4>
          <button data-color="positive" data-shape="line">홈으로</button>
        </div>
      </div>
  `;

  document.querySelector('button').addEventListener('click', () => {
    if (getUserRole() === 'admin') {
      history.pushState(null, null, '/admin');
      route();
    } else {
      history.pushState(null, null, '/');
      route();
    }
  });
};
