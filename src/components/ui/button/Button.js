export default function Button({
  width = 80,
  height = 42,
  text,
  color,
  onClick,
  borderRedius = 10,
  id,
}) {
  const button = document.createElement('button');
  console.log(button);
  button.style.backgroundColor = color;
  button.textContent = text;
  button.style.width = `${width}px`;
  button.style.height = `${height}px`;
  button.style.borderRadius = `${borderRedius}px`; // 수정된 부분
  button.id = id;
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}
