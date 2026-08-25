window.ValidatorUtils = (function () {
  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");
  }

  function arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    const left = a.slice().sort();
    const right = b.slice().sort();
    return left.every((item, index) => String(item) === String(right[index]));
  }

  function matchesKeywords(text, keywords) {
    const source = String(text || "");
    return Array.isArray(keywords) && keywords.some((keyword) => source.includes(keyword));
  }

  return { normalizeText, arraysEqual, matchesKeywords };
})();