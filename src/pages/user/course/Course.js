export default class UserCoursePage {
  constructor() {
    const CONTENT = document.getElementById('content');
    this.content = CONTENT;
    this.render();
  }

  render() {
    this.content.innerHTML = `
            <div>이 곳은 사용자 커리큘럼 페이지입니다.</div>
      `;
  }
}
