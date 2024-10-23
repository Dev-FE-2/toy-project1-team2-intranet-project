import './Layout.css';
const RenderLayout = container => {
  container.innerHTML = `
    <div class="header"></div>
    <div class="content-container">
      <div class="navbar"></div>
      <div class="content"></div>
    </div>
  `;
};

export default RenderLayout;
