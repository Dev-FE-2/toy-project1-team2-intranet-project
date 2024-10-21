export default class UserNoticePage {
  constructor() {
    const CONTENT = document.getElementById('content');
    this.content = CONTENT;
    this.render();
  }

  render() {
    this.content.innerHTML = `
              <div>이 곳은 사용자 공지사항 목록 페이지입니다.</div>
        `;
  }
}
