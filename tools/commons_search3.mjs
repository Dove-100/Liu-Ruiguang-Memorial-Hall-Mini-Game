import { writeFileSync } from "node:fs";
const UA = "CodexImageReplacer/1.0 (Wikimedia Commons image search; contact: none)";
const API = "https://commons.wikimedia.org/w/api.php";
const queries = [
  ["luriguang_residence", "Lu Ruiguang former residence"],
  ["nongran_village2", "弄染村"],
  ["huangguoshu", "Huangguoshu Waterfall"],
  ["chinese_calligraphy", "Chinese calligraphy brush ink"],
  ["old_books", "old books library archive"],
  ["guizhou_landscape", "Guizhou landscape"],
  ["red_army2", "Chinese Workers and Peasants Red Army"],
  ["bajiaoyan2", "Bajiaoyan"],
  ["miao_village2", "Miao village Guizhou mountains"],
  ["zhenning_town", "Zhenning county town Guizhou"],
];
async function api(params) {
  const url = `${API}?${new URLSearchParams(params).toString()}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
const out = [];
for (const [label, q] of queries) {
  try {
    const search = await api({ action: "query", format: "json", list: "search", srnamespace: "6", srlimit: "10", srsearch: q });
    const hits = (search.query && search.query.search) || [];
    if (hits.length) {
      const titles = hits.map((h) => h.title).join("|");
      const info = await api({ action: "query", format: "json", prop: "imageinfo", iiprop: "url|mime|size|extmetadata", iiurlwidth: "1600", titles });
      const pages = Object.values(info.query.pages);
      for (const h of hits) {
        const page = pages.find((p) => p.title === h.title);
        const ii = page && page.imageinfo && page.imageinfo[0];
        out.push({ label, title: h.title, mime: ii ? ii.mime : "", width: ii ? ii.width : "", height: ii ? ii.height : "", original: ii ? ii.url : "", thumburl: ii && ii.thumburl ? ii.thumburl : "", license: ii && ii.extmetadata && ii.extmetadata.LicenseShortName ? ii.extmetadata.LicenseShortName.value : "" });
      }
    }
  } catch (e) { out.push({ label, title: "ERROR", mime: String(e.message || e) }); }
  await new Promise((r) => setTimeout(r, 2000));
}
writeFileSync("tools/commons_results3.json", JSON.stringify(out, null, 2), "utf8");
console.log("label\ttitle\tmime\tWxH\tlicense");
for (const r of out) console.log([r.label, r.title, r.mime, r.width ? `${r.width}x${r.height}` : "", r.license].join("\t"));
