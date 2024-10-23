import route from './routes/Router';
import './styles/global.css';

const navigate = event => {
  const anchor = event.target.closest('a');

  if (anchor?.href) {
    event.preventDefault();
    history.pushState(null, null, anchor.href);
    route();
  }
};

function App() {
  window.addEventListener('popstate', route); //브라우저에서 뒤로 가기 또는 앞으로 가기 버튼을 눌렀을 때 발생, 이에 맞게 페이지를 다시 렌더링함
  document.body.addEventListener('click', navigate); //navBar의 링크를 클릭할 때 주소를 변경하고, 해당 페이지를 렌더링함
  route(); //페이지가 로드될 때 한 번 바로 실행
}

document.addEventListener('DOMContentLoaded', App);
