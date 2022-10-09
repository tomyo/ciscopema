import { songkickArtistUrl } from "../config.js";

export const config = {
  runtime: 'experimental-edge',
};

export default async (req) => {
  return new Response(await (await fetch(songkickArtistUrl)).text());
}