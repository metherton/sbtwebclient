import { html, css, LitElement } from 'lit-element';

export class PageMain extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        text-align: center;
      }

      svg {
        animation: app-logo-spin infinite 20s linear;
      }

      @keyframes app-logo-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      logo: { type: Function },
      persons: { type: Array}
    };
  }

  constructor() {
    super();
    this.title = 'Hello open-wc world!';
    this.logo = html``;
  }

  connectedCallback() {
    super.connectedCallback();

    fetch('http://localhost:8080/persons')
      .then(r => r.json())
      .then((r) => {
        this.persons = r.map((person, i) => ({...person, id: i}) );
      });
  }

  render() {
    return html`
      <div class="persons">
        ${this.persons.map(person => html`
          <div>${person.firstName}</div>`)}
      </div>
    `;
  }
}
