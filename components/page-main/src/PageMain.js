import { html, css, LitElement } from 'lit-element';
import { from } from 'rxjs';

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
      persons: { type: Array},
      personsObserver: {type: Object}
    };
  }

  constructor() {
    super();
    this.persons = [];
  }

  loadWithFetch() {
    return from(fetch('http://localhost:8080/persons').then(r => r.json()).then(r => this.persons = r));
  }

  connectedCallback() {
    super.connectedCallback();

    this.personsObserver = from(this.persons)
    this.personsObserver.subscribe(this.render, e => console.log(e), () => console.log('complete'));

    this.loadWithFetch();

  }

  async postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  async addPerson() {
    await this.executeAddPerson();
    this.loadWithFetch();
  }

  async executeAddPerson() {
    try {
      const data = await (this.postData('http://localhost:8080/persons', { firstName: "Charles", surname: "Etherton" }));
      console.log(JSON.stringify(data)); // JSON-string from `response.json()` call

    } catch (error) {
      console.error(error);
    }
   // this.persons.push({firstName: "Charles"});
  }

  render() {
    return html`
      <button @click=${this.addPerson}>
        Add Person
      </button>
      <table class="persons">
        <tr><th>Surname</th><th>First Name</th></tr>
        ${this.persons.map(person => html`
          <tr>
            <td>${person.surname}</td>
            <td>${person.firstName}</td>
          </tr>`)}
      </table>
    `;
  }
}
