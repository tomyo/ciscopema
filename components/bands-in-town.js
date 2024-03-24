customElements.define(
  "bands-in-town",
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        
        <slot></slot>
      `;
    }

    handleEvent(event) {
      this[`on${event.type}`]?.(event);
    }

    connectedCallback() {
      this.shadowRoot.addEventListener("slotchange", this);
    }

    async onslotchange(event) {
      setTimeout(
        () => document.querySelector(".bit-follow-section-wrapper")?.remove(),
        1000
      );
    }
  }
);
