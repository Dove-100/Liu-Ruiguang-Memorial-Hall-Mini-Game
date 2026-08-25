window.StorageUtils = (function () {
  const PREFIX = "lrg_";

  function get(key, defaultVal) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? defaultVal : JSON.parse(raw);
    } catch (error) {
      return defaultVal;
    }
  }

  function set(key, val) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(val));
      return true;
    } catch (error) {
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (error) {
      // 忽略清理失败，不影响游戏流程
    }
  }

  return { get, set, remove };
})();