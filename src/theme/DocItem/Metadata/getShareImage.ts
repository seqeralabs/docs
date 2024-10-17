function getShareImage(event) {
  // const host = "https://seqera.io";
  // const host = "http://localhost:3000";
  const host = "https://deploy-preview-264--seqera.netlify.app";
  const path = "og-generate.png";

  const info = {
    title: event.title,
  };

  let queryString = "";
  for (const key in info) {
    if (queryString) queryString += "&";
    queryString += key + "=" + encodeURIComponent(info[key]);
  }

  return `${host}/${path}?${queryString}`;
}

export default getShareImage;
