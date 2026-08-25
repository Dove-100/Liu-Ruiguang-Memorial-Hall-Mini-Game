window.QrParser = (function () {
  const HIDDEN_PARAMS = ["unlock", "easter", "clue"];

  function getQueryParams(search) {
    const params = {};
    const query = String(search || window.location.search).replace(/^\?/, "");
    if (!query) return params;

    query.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (!key) return;
      try {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      } catch (error) {
        params[key] = value || "";
      }
    });

    return params;
  }

  function parseHiddenUnlocks() {
    const params = getQueryParams();
    return HIDDEN_PARAMS
      .map((key) => params[key])
      .filter(Boolean)
      .map((value) => String(value).trim());
  }

  function normalizeUnlockId(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  return { getQueryParams, parseHiddenUnlocks, normalizeUnlockId };
})();