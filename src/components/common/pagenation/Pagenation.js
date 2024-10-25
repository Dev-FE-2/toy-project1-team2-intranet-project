import { Button } from '../../ui/button/Button';
import './Pagenation.css';

// [보여줄 데이터, 보여줄 갯수, 현재 페이지, callback 함수]
export const Pagenation = (
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
) => {
  const totalPages =
    Math.ceil(totalItems / itemsPerPage) === 0
      ? 1
      : Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.createElement('div');
  for (let i = 1; i <= totalPages; i++) {
    const paginationButton = Button({
      width: 50,
      text: `${i}`,
      color: 'transparent',
      id: `page-${i}`,
      shape: 'white',
    });

    // 현재 페이지인 경우 버튼을 활성화
    if (i === currentPage) {
      paginationButton.classList.add('active');
    }

    paginationButton.setAttribute('data-page', i);
    paginationButton.classList.add('pagination-btn');

    // 버튼 클릭 시 페이지 변경 함수 호출
    paginationButton.addEventListener('click', () => {
      onPageChange(i); // 페이지 변경 시 콜백 함수 호출
    });

    paginationContainer.appendChild(paginationButton);
  }
  return paginationContainer; // HTML 요소를 반환
};
