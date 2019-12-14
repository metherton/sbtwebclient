import { html, css, LitElement } from 'lit-element';
import { from } from 'rxjs';

export class PageMain extends LitElement {
  static get styles() {
    return css`
      :host {
        width: 100%;
        display: block;
        padding: 25px;
        text-align: center;
      }

      thead {
        border-bottom: 2px solid navy;
      }

      td, th {
        padding-top: 8px;
        padding-bottom: 8px;
      }

      td {
        border-bottom: 1px solid silver;
      }

      thead.header tr {
        background-color: #ededed;
      }

      tr:nth-child(odd) {
        background-color: white;
      }

      table {
        font-size: 0.5em;
        width: 100%;
        border-collapse: collapse;
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
      const data = await (this.postData('http://localhost:8080/persons', { firstName: "Charles", surname: "Etherton", dateOfBirth: 1576348854, address: "1 High St", city: "London", country: "England" }));
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
        <thead class="header"><th>Surname</th><th>First Name</th><th>Date of Birth</th><th>Address</th><th>City</th><th>Country</th></thead>
        ${this.persons.map(person => html`
          <tr>
            <td>${person.surname}</td>
            <td>${person.firstName}</td>
            <td>${person.dateOfBirth}</td>
            <td>${person.address}</td>
            <td>${person.city}</td>
            <td>${person.country}</td>
          </tr>`)}
      </table>
    `;
  }
}
