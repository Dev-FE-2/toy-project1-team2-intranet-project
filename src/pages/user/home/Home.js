export const RenderUserHome = container => {
  container.innerHTML = `
     <div class="my-info desktop-only">
          <div class="wrapper">
            <h2 class="home-subtitle">내 정보</h2>
          </div>
          <div class="personal-info-container"></div>
        </div>

        <section class="gallery-section">
          <div class="wrapper">
            <h2 class="home-subtitle">공지사항 갤러리</h2>
            <ul class="gallery"></ul>
          </div>
        </section>

        <section class="announcement-container">
          <div class="wrapper">
            <h2 class="home-subtitle">주요 소식</h2>
            <ul class="announcement-contents">
              <li class = "announcement-item">소식 1</li> <!-- 컴포넌트 추가 -->
              <li class = "announcement-item">소식 2</li> <!-- 컴포넌트 추가 -->
              <li class = "announcement-item">소식 3</li> <!-- 컴포넌트 추가 -->
            </ul>
          </div>
        </section>
      </div>
  `;
};
