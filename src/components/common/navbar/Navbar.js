import './Navbar.css';

export function RenderNavbar(navbar, menu) {
  if (!navbar) {
    console.error('navbar element is not found');
    return;
  }

  const isActiveMenu = path => window.location.pathname === path;

  navbar.innerHTML = `
    <div class="navbar-top">
      <div class="logo-circle"></div>      
      <h1>DOPAMING</h1>
    </div>
    <ul class="menu">
      ${menu
        .map(menu => {
          const isActive = isActiveMenu(menu.path);
          return `
            <li class="menu-item">
              <a href="${menu.path}" class="menu-link ${isActive ? 'active' : ''}">
                <span class="material-symbols-rounded">
                  ${menu.icon}
                </span>   
                ${menu.title}   
              </a>
            </li>`;
        })
        .join('')}      
      </ul>
  `;
}
