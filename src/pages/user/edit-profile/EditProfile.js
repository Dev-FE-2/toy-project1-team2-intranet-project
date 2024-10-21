export default class UserEditProfilePage {
  constructor() {
    const CONTENT = document.getElementById('content');
    this.content = CONTENT;
    this.render();
  }

  render() {
    this.content.innerHTML = `
              <div>이 곳은 사용자 정보 수정 페이지입니다.</div>
        `;
  }
}
