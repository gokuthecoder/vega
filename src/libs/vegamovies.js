import { fetchWrapper } from './fetchwrapper.js';

const BASE_URL = `${process.env.DOMAIN_NAME}/wp-json/wp/v2`;

export async function getVegamoviesPost(postId) {
  const url = `${BASE_URL}/posts/${postId}`;
  return await fetchWrapper(url);
}
