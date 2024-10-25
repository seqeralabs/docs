function getShareImage(item) {
  const host = "https://docs.seqera.io";
  const path = "og-generate.png";

  let title = item.title;
  const wordCount = title.split(" ").length;
  if (wordCount === 1) {
    let source = item.sourceDirName;
    if (source === "cli") source = "CLI";
    if (source === "api") source = "API";
    title = `${title} (${source})`;
  }

  const info = {
    title,
    subTitle: item.description,
  };

  let queryString = "";
  for (const key in info) {
    if (queryString) queryString += "&";
    queryString += key + "=" + encodeURIComponent(info[key]);
  }

  return `${host}/${path}?${queryString}`;
}

export default getShareImage;
