export default class AdminMemberPage {
  constructor() {
    const CONTENT = document.getElementById('content');
    this.content = CONTENT;
    this.render();
  }

  render() {
    this.content.innerHTML = `
        <div>이 곳은 관리자 직원 관리 페이지입니다.</div>
    `;
  }
}
