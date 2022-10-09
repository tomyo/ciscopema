export const config = {
  runtime: 'experimental-edge',
};

export default async (req) => {
  const songkickArtistUrl = 'https://www.songkick.com/artists/9553324-cisco-pema';
  const htmlText = await (await fetch(songkickArtistUrl)).text();
  const regExp = /(<ol.+artist-calendar-summary[\w\W]+?)\s*<p class=".*see-all/i;

  if (!htmlText.match(regExp)) {
    return new Response().status(404).end();
  }

  return new Response(htmlText.match(regExp)[1]);
}