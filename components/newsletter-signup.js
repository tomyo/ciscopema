const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxLnyhDPovdhSAjIuqguQ-fc2Jz8SvM2WdjomrSLI6Ge7IMsxjwofTOEcgKjVFsCFFzIw/exec";

customElements.define(
  "newsletter-signup",
  class extends HTMLElement {
    constructor() {
      super();

      this.submitButtonTexts = {
        default: "Subscribe",
        loading: "Subscribing...",
        success: "Subscribed! 😎",
      };
    }

    connectedCallback() {
      this.innerHTML = /*html*/ `
        <form style="display: grid; gap: 1rem">
          <h3 data-l10n-key="subscribe-to-newsletter">Subscribe to Newsletter</h3>
          <input name="email" type="email" placeholder="Email" required />
          <input name="name" type="text" placeholder="Name (Optional)" />
          <button type="submit">${this.submitButtonTexts["default"]}</button>
        </form>
      `;

      this.form = this.querySelector("form");
      this.submitButton = this.querySelector("button[type=submit]");

      this.form.addEventListener("submit", this);
    }

    handleEvent(event) {
      this[`on${event.type}`]?.(event);
    }

    resetSubmitButton() {
      this.submitButton.disabled = false;
      this.submitButton.textContent = this.submitButtonTexts["default"];
    }

    async onsubmit(event) {
      event.preventDefault();
      this.submitButton.disabled = true;
      this.submitButton.textContent = this.submitButtonTexts["loading"];

      try {
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          body: new FormData(this.form),
        });

        if (response.ok) {
          this.submitButton.textContent = this.submitButtonTexts["success"];
        } else {
          throw new Error("Failed to subscribe. Please try again later.");
        }
      } catch (e) {
        alert(e.message);
        resetSubmitButton();
      }
    }
  }
);
