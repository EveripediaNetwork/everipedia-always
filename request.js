const wikipediaurl = "en.wikipedia.org";
const envMap = {
  production: "everipedia.org",
  staging: "epdev123.org",
};
const host = envMap.production;

/************************ REDIRECT CODE ***********************/
chrome.webRequest.onBeforeRequest.addListener(
  redirectAsync,
  {
    urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame"],
  },
  ["blocking"]
);

function redirectAsync(details) {
  var url = details.url;
  var https = "https://";
  // ignore links with these strings in them
  var filter = "(sa-no-redirect=)" + "|(http://)"; //all wikipedia pages now redirect to HTTPS, also fixes conflict with HTTPS Everywhere extension

  if (
    url.includes(".php") /* some wikipedia pages fetch as php file */ ||
    !url.includes(wikipediaurl) /* chrome extension url's run this file too */
  ) {
    return;
  }

  // Don't try and redirect pages that are in our filter
  if (url.match(filter) != null) {
    return;
  }

  const redirectUrl = https + host + getRelativeRedirectUrl(url, host);
  return {
    redirectUrl,
  };
}

function getRelativeRedirectUrl(url, host) {
  var relativeUrl = url.split(wikipediaurl)[1] || url.split(host)[1];
  var paramStart = "?";
  var paramStartRegex = "\\" + paramStart;
  var newurl = null;

  // check to see if there are already GET variables in the url
  if (relativeUrl.match(paramStartRegex) != null) {
    newurl = relativeUrl + "&";
  } else {
    newurl = relativeUrl + paramStart;
  }
  return newurl;
}
