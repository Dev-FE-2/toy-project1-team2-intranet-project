export default class UserWorkDetailPage {
  constructor() {
    const CONTENT = document.getElementById('content');
    this.content = CONTENT;
    this.render();
  }

  render() {
    this.content.innerHTML = `
              <div>이 곳은 사용자 출/퇴근 상세 페이지입니다.</div>
        `;
  }
}
