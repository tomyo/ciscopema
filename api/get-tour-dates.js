export default async function handler(request, response) {
  const htmlText = await (await fetch('https://www.songkick.com/artists/9553324-cisco-pema')).text();
  const regExp = /(<ol.+artist-calendar-summary[\w\W]+?)<p class="see-all"/i;

  if (!htmlText.match(regExp)) {
    return response.status(404).end();
  }

  response.end(htmlText.match(regExp)[1]);
}