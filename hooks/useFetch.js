export async function fetcher(params) {
  const [url, id] = params;
  const res = await fetch(`${url}?id=${id}`);
  return res.json();
}
