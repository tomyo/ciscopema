import { regExp, songkickArtistUrl } from "../config";

export const config = {
  runtime: 'experimental-edge',
};

export default async (req) => {
  const htmlText = await (await fetch(songkickArtistUrl)).text();

  if (!htmlText.match(regExp)) {
    return new Response().status(404).end();
  }

  return new Response(htmlText.match(regExp)[0]);
}