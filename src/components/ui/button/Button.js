import './Button.css';

export function Button({
  className = '',
  text = '',
  color,
  shape,
  padding = 'var(--space-small) var(--space-medium)',
  borderRadius = 10,
  fontSize = 'var(--font-medium)',
  fontWeight = 500,
  transition = 'all 0.3s',
  cursor = 'pointer',
  onClick,
}) {
  const button = document.createElement('button'); // 버튼의 기본 스타일 및 속성 설정
  button.className = className;
  button.textContent = text;
  button.style.borderRadius = `${borderRadius}px`;
  button.style.fontSize = fontSize;
  button.style.padding = padding;
  button.style.padding = padding;
  button.style.borderRadius = `${borderRadius}px`;
  button.style.fontSize = fontSize;
  button.style.fontWeight = fontWeight;
  button.style.transition = transition;
  button.style.cursor = cursor;
  button.setAttribute('color', color); // 예: 'white'
  button.setAttribute('shape', shape); // 예: 'line'
  if (onClick) {
    button.addEventListener('click', onClick);
  } // 버튼을 DOM에 추가

  return button;
}
