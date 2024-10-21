export default class UserPeerPage {
  constructor() {
    const CONTENT = document.getElementById('content');
    this.content = CONTENT;
    this.render();
  }

  render() {
    this.content.innerHTML = `
            <div>이 곳은 사용자 수강생 목록 페이지입니다.</div>
      `;
  }
}
