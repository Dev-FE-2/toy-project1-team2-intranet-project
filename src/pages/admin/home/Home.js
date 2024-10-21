export default class AdminHomePage {
  constructor() {
    const CONTENT = document.getElementById('content');
    this.content = CONTENT;
    this.render();
  }

  render() {
    this.content.innerHTML = `
        <div>이 곳은 관지자 홈페이지입니다.</div>
      `;
  }
}
