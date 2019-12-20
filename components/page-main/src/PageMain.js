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

      div.person {
        text-align: left;
        font-size: 0.8em;
      }

      div.person:nth-child(odd) {
        background-color: ghostwhite;
      }

      div.person:nth-child(even) {
        background-color: gainsboro;
      }

      button {
        font-size: 1.0em;
      }

      table {
        font-size: 0.5em;
        width: 100%;
        border-collapse: collapse;
        margin-top: 30px;
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

      #modal-btn {
        cursor: pointer;
        font-size: 20px;
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid black;
        line-height: 16px;
        text-align: center;
        -webkit-box-sizing: border-box;
           -moz-box-sizing: border-box;
                box-sizing: border-box;
      }

      .modal {
        font-size: 0.8em;
        display: none;
        position: fixed;
        padding-top: 50px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

      }
      .modal-content {
        background-color: lightgoldenrodyellow;
        position: relative;
        padding: 20px;
        margin: auto;
        width: 75%;
        -webkit-animation-name: animatetop;
        -webkit-animation-duration: 0.4s;
        animation-name: animatetop;
        animation-duration: 0.4s
      }
      .close-btn {
        cursor: pointer;
        float: right;
        color: lightgray;
        font-size: 24px;
        font-weight: bold;
      }
      .close-btn:hover {
        color: darkgray;
      }
      @-webkit-keyframes animatetop {
        from {top:-300px; opacity:0}
        to {top:0; opacity:1}
      }
      @keyframes animatetop {
        from {top:-300px; opacity:0}
        to {top:0; opacity:1}
      }
      .flex-container {
        display: flex;
      }
      .flex-container > div {
        margin: 10px;
        padding: 20px;
        min-width: 250px;
      }
      input {
        font-size: 0.8em;
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      logo: { type: Function },
      persons: { type: Array},
      personsObserver: {type: Object},
      firstName: {type: String},
      surname: {type: String},
      dateOfBirth: {type: Number},
      address: {type: String},
      city: {type: String},
      country: {type: String},
      bla: {type: String}
    };
  }

  constructor() {
    super();
    this.persons = [];
    this.firstName = '';
    this.surname = '';
    this.dateOfBirth = 1576348854;
    this.address = '';
    this.city = '';
    this.country = '';
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

  // called the first time your element has been rendered, can be useful when you need
  // to access your DOM elements
  // changedProperties is a Map
  firstUpdated(changedProperties) {
    let modalBtn = this.shadowRoot.querySelector("#modal-btn")
    let modal = this.shadowRoot.querySelector(".modal")
    let closeBtn = this.shadowRoot.querySelector(".close-btn")
    modalBtn.onclick = function(){
      modal.style.display = "block"
    }
    closeBtn.onclick = function(){
      modal.style.display = "none"
    }
    window.onclick = function(e){
      if(e.target == modal){
        modal.style.display = "none"
      }
    }
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

  async executeAddPerson() {

    try {
      const data = await (this.postData('http://localhost:8080/persons', { firstName: this.firstName, surname: this.surname, dateOfBirth: Date.parse(this.dateOfBirth), address: this.address, city: this.city, country: this.country }));
      console.log(JSON.stringify(data)); // JSON-string from `response.json()` call

    } catch (error) {
      console.error(error);
    }
   // this.persons.push({firstName: "Charles"});
    this.shadowRoot.querySelector(".close-btn").click();
  }

  timestampAsDate(timestamp) {
    let date = new Date(timestamp);
    return date.toDateString();
  }

  async clickHandler(e) {
    console.log(e.target);
    await this.executeAddPerson();
    this.loadWithFetch();
  }

  updateField(e) {
    switch(e.target.id) {
      case "firstName":
        this.firstName = e.target.value;
        break;
      case "surname":
        this.surname = e.target.value;
        break;
      case "dateOfBirth":
        this.dateOfBirth = e.target.value;
        break;
      case "address":
        this.address = e.target.value;
        break;
      case "city":
        this.city = e.target.value;
        break;
      case "country":
        this.country = e.target.value;
        break;
      default:
        console.log(e.target.id);
        break;
    }
  }

  render() {
    return html`
      <span @click=${this.addPerson} id="modal-btn">+</span><br />
      <div id="addPerson" class="modal">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <h3>Add a new person</h3>
          <br />
          <div class="flex-container">
            <div><label for="firstName">First Name:</label>&nbsp;<input id="firstName" @change="${this.updateField}" type="text" .value="${this.firstName}"/></div>
            <div><label for="surname">Surname:</label>&nbsp;<input id="surname" @change="${this.updateField}" type="text" .value="${this.surname}"/></div>
            <div><label for="dateOfBirth">Date of Birth:</label>&nbsp;<input id="dateOfBirth" @change="${this.updateField}" type="date" .value="${this.dateOfBirth}"/></div>
          </div>
          <div class="flex-container">
            <div><label for="address">Address:</label>&nbsp;<input id="address" @change="${this.updateField}" type="text" .value="${this.address}"/></div>
            <div><label for="city">City:</label>&nbsp;<input id="city" @change="${this.updateField}" type="text" .value="${this.city}"/></div>
            <div><label for="country">Country:</label>&nbsp;<input id="country" @change="${this.updateField}" type="text" .value="${this.country}"/></div>
          </div>
          <br />
          <div>
            <button @click="${this.clickHandler}">Submit</button>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;font-size:0.8em;">
              ${this.persons.map(person => html`
                  <div class="person">
                    <div style="padding: 0.5em">England & Wales Civil Registration Birth 1836-1987</div>
                    <div style="padding-left:3em;padding-top: 1em;padding-bottom:1em;">
                      <div style="padding: 0.5em;">Name: ${person.firstName}&nbsp;${person.surname}</div>
                      <div style="padding: 0.5em">Birth: ${this.timestampAsDate(person.dateOfBirth)}&nbsp;,&nbsp;${person.city}&nbsp;,&nbsp;${person.country}
                    <div>
                  </div>

                `)}
      </div>
    `;
  }
}
