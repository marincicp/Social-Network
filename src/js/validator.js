class Validator {
  constructor(config, formID) {
    this.elementsConfig = config;
    this.formID = formID;
    this.errors = {};

    this.generateErrorsObject();
    this.inputListener();
  }

  generateErrorsObject() {
    for (let field in this.elementsConfig) {
      this.errors[field] = [];
    }
  }

  inputListener() {
    for (let field in this.elementsConfig) {
      let el = document.querySelector(`${this.formID} input[name="${field}"]`);

      el.addEventListener("input", this.validate.bind(this));
    }
  }

  validate(e) {
    let elementsFields = this.elementsConfig;
    let elField = e.target;
    let elName = elField.getAttribute("name");
    let elValue = elField.value;

    this.errors[elName] = [];

    if (elementsFields[elName].required) {
      if (elValue === "") {
        this.errors[elName].push("Field is empty!");
      }
    }

    if (
      elementsFields[elName].minlength > elValue.length ||
      elementsFields[elName].minlength > elValue.length
    ) {
      this.errors[elName].push("Field must have between 5 and 15 characher !");
    }

    if (elementsFields[elName].matching) {
      let matchingEl = document.querySelector(
        `${this.formID} input[name="${elementsFields[elName].matching}"]`
      );

      if (elValue !== matchingEl.value) {
        this.errors[elName].push("Passwords not same!");
      }

      if (this.errors[elName].length === 0) {
        this.errors[elName] = [];
        this.errors[elementsFields[elName].matching] = [];
      }
    }

    if (elementsFields[elName].email) {
      if (!this.validateEmail(elValue)) {
        this.errors[elName].push("Incorrect email !");
      }
    }

    this.populateError(this.errors);
  }

  validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }

    return false;
  }

  validatePassed() {
    for (let key of Object.keys(this.errors)) {
      if (this.errors[key].length > 0) {
        return false;
      }
    }
    return true;
  }

  populateError(errors) {
    // for (let elem of document.querySelectorAll("li")) {
    //   elem.remove();
    // }

    for (let key of Object.keys(errors)) {
      const parentEl = document.querySelector(
        `${this.formID} input[name="${key}"]`
      ).parentElement;

      let ulList = parentEl.querySelector("ul");
      ulList.innerHTML = "";
      errors[key].forEach((err) => {
        let markup = `
        <li>${err}</li>
      `;
        ulList.insertAdjacentHTML("beforeend", markup);
      });
    }
  }
}
