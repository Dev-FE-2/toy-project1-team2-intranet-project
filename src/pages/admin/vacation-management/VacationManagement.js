import { RenderAdminVacationManagementHeader } from '../../../components/admin/vacation-management/VacationHeader';
import { RenderAdminVacationManagementList } from '../../../components/admin/vacation-management/VacationList';

export const RenderAdminVacationManagement = container => {
  container.innerHTML = `
    <main class="admin-vacation-management-container">
      <div id="adminVacationManagementHeaderSection"></div>
      <div id="adminVacationMangementListSection"></div>
    </main>
  `;

  const headerSection = document.querySelector(
    '#adminVacationManagementHeaderSection',
  );
  const memberListSection = document.querySelector(
    '#adminVacationMangementListSection',
  );

  RenderAdminVacationManagementHeader(headerSection);
  RenderAdminVacationManagementList(memberListSection);
};
