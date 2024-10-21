export default class AdminVactionManagementPage {
  constructor() {
    const CONTENT = document.getElementById('content');
    this.content = CONTENT;
    this.render();
  }

  render() {
    this.content.innerHTML = `
            <div>이 곳은 관리자 휴가/공가 관리 페이지입니다.</div>
      `;
  }
}
