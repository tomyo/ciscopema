const tourDatesApiUrl = '/api/get-tour-dates/';
const tourLinksUrlPrefix = 'https://www.songkick.com/';

async function fetchEventListHtml() {
  function prefixUrls(text) {
    return text.replaceAll(/(href=")\//gi, `$1${tourLinksUrlPrefix}`);
  }

  const response = await fetch(tourDatesApiUrl);
  if (!response?.ok) throw new Error(`Error getting tour-dates, reponse status: ${response.status}`);

  return prefixUrls(await response.text());
}

customElements.define('tour-dates', class extends HTMLElement {
  constructor() {
    super();
    this.setUpEventsFetching();
  }

  setUpEventsFetching() {
    if (this.getAttribute('loading') == 'lazy') {
      /* Only fetch and format events when component is visible */
      new IntersectionObserver((entries, observer) => {
        if (![...entries][0].isIntersecting) return;

        this.fetchAndRenderEventList();
        observer.unobserve(this);
      }).observe(this);
    } else {
      this.fetchAndRenderEventList();
    }
  }

  async fetchAndRenderEventList() {
    try {
      const eventListNode = await fetchAndFormatEventList(this.getLocale());
      this.attachShadow({ mode: 'open' }).appendChild(eventListNode);
    } catch (error) {
      console.error(error.message);
      console.info('Using original widget as fallback ...');
      this.insertFallbackContent();
    }
  }

  getLocale() {
    return document.documentElement.lang || this.getAttribute('lang') || 'en';
  }

  insertFallbackContent() {
    // Use original songkick widget
    this.innerHTML = `
      <a href="https://www.songkick.com/artists/9553324" class="songkick-widget" 
        data-font-color="black" data-track-button="off" data-theme="light"
        data-locale="en" data-background-color="transparent" data-detect-style="true">
        Cisco Pema
      </a>
    `
    const script = document.createElement('script');
    script.setAttribute('src', "//widget.songkick.com/9553324/widget.js");
    this.appendChild(script);
  }
});

/**
 * 
 * @param {String} locale 
 * @returns A DOM node containing the fetched and formated even list content
 */
async function fetchAndFormatEventList(locale = 'en') {
  const template = document.createElement('template');
  template.innerHTML = await fetchEventListHtml();

  function formatDate(date) {
    const options = { weekday: "short", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(locale, options);
  }

  // adjustDateFormat
  for (const dateBox of template.content.querySelectorAll('.date-box')) {
    const date = dateBox.previousElementSibling.dateTime;
    dateBox.innerText = formatDate(date).replace(',', '');
  }

  // adjustEventsLocation
  for (const div of template.content.querySelectorAll('.event-details')) {
    const strong = div.querySelector('.primary-detail');
    const p = document.createElement('p');
    p.innerText = strong.innerText;
    strong.remove();
    div.appendChild(p);
  }

  // addTicketButtons
  for (const a of template.content.querySelectorAll('.event-listing a')) {
    const button = document.createElement('button');
    button.innerText = 'Tickets';
    button.part = 'button';
    a.appendChild(button);
  }

  // Add style
  const style = document.createElement('style');
  style.innerHTML = /*css*/`
      :host {
        display: block;
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
        border-block-start: 1px solid hsla(0,0%, var(--border-lightness, 0%), .2);
        padding-inline: 1ch;
      }

      .event-listing:hover {
        background-color: hsla(0,0%, var(--hover-lightness, 100%), .15);
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
        line-height: 1.4em;
      }
    `
  template.content.appendChild(style);

  return template.content;
}
