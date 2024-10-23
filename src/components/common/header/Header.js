import './Header.css';

export function RenderHeader(header, isUser, editProfilePath = '') {
  if (!header) {
    console.error('header element is not found');
    return;
  }

  header.innerHTML = `
    <div class="header-items">
      <div class="user-name">김아무</div>
      <button class="logout">로그아웃</button>
    </div>
    <div class="circle" style="cursor: ${isUser ? 'pointer' : 'default'}">
      ${isUser ? '' : `<a href="${editProfilePath}"></a>`}
    </div>
  `;
}
