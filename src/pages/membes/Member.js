import Container from '../../Container';

export default class MembersPage extends Container {
  constructor() {
    super('.content');
    // this.render();
  }

  render() {
    this.$container.innerHTML = `
          <div id='members-container'>
            45          
          </div>
        </div>
          <div class='pagination-container'>
          123
          </div>
      </div>
    `;
  }
}
