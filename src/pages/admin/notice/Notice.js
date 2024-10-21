export default class AdminNoticePage {
  constructor() {
    const CONTENT = document.getElementById('content');
    this.content = CONTENT;
    this.render();
  }

  render() {
    this.content.innerHTML = `
          <div>이 곳은 관리자 공지사항 페이지입니다.</div>
    `;
  }
}
