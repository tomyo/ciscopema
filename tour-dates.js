const tourDatesApiUrl = '/api/get-tour-dates/';
const tourLinksUrlPrefix = 'https://www.songkick.com/';

async function fetchEventListHtml() {
  const response = await fetch(tourDatesApiUrl);
  if (!response?.ok) throw new Error(`Error getting tour-dates, reponse status: ${response.status}`);

  const text = await response.text();
  return adaptUrls(text);
}

function adaptUrls(text) {
  return text.replaceAll(/(href=")\//gi, `$1${tourLinksUrlPrefix}`);
}

customElements.define('tour-dates', class extends HTMLElement {
  async connectedCallback() {
    try {
      const content = await fetchEventListHtml();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = content;
      this.appendStyles();
      this.adjustDatesFormat();
      this.adjustEventsLocation();
      this.addTicketButtons();
    } catch (error) {
      console.error(error.message);
      console.info('Using original widget as fallback ...');
      this.insertFallbackContent();
    }
  }

  getLocale() {
    return document.documentElement.lang || this.getAttribute('lang') || 'en';
  }

  formatDate(date) {
    const options = { weekday: "short", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(this.getLocale(), options);
  }

  adjustDatesFormat() {
    for (const dateBox of this.shadowRoot.querySelectorAll('.date-box')) {
      const date = dateBox.previousElementSibling.dateTime;
      dateBox.innerText = this.formatDate(date).replace(',', '');
    }
  }

  adjustEventsLocation() {
    for (const div of this.shadowRoot.querySelectorAll('.event-details')) {
      const strong = div.querySelector('.primary-detail');
      const p = document.createElement('p');
      p.innerText = strong.innerText;
      strong.remove();
      div.appendChild(p);
    }
  }

  addTicketButtons() {
    for (const a of this.shadowRoot.querySelectorAll('.event-listing a')) {
      const button = document.createElement('button');
      button.innerText = 'Tickets';
      button.part = 'button';
      a.appendChild(button);
    }
  }

  appendStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
    :host {
      display: block;
    }

    :root {
      line-height: 1.231em;
    }

    a {
      text-decoration: none;
      display: flex;
      flex-direction: column;
    }

    a button {
      margin-block: 1rem;
      cursor: pointer;
    }

    * {
      color: inherit;
      fill: inherit;
      font-family: inherit;
    }
    
    ol {
      padding-inline-start: 0;
      list-style: none;
    }

    .event-listing  {
      border-block-start: 1px solid hsla(0,0%,100%,.2);
      padding-inline: 1ch;
    }

    .event-listing:hover {
      background-color: hsla(0,0%,100%,.15);
    }

    .date-box {
      display: flex;
      gap: 1ch;
      font-size: .8em;
      font-weight: 700;
      margin-bottom: .182em;
      text-transform: uppercase;
      margin-block: 1em;
    }

    .event-details p {
      margin-block: 0;
      line-height: 2ch;
    }
    `
    this.shadowRoot.appendChild(style);
  }

  insertFallbackContent() {
    // Use original songkick widget
    this.innerHTML = `
      <a href="https://www.songkick.com/artists/9553324" class="songkick-widget" 
        data-font-color="white" data-track-button="off" data-theme="dark"
        data-locale="en" data-background-color="transparent" data-detect-style="true">
        Cisco Pema
      </a>
    `
    const script = document.createElement('script');
    script.setAttribute('src', "//widget.songkick.com/9553324/widget.js");
    this.appendChild(script);
  }


});