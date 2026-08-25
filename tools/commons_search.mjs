import { writeFileSync } from "node:fs";

const UA = "CodexImageReplacer/1.0 (Wikimedia Commons image search)";
const API = "https://commons.wikimedia.org/w/api.php";
const queries = [
  ["luriguang", "陆瑞光"],
  ["luriguang_en", "Lu Ruiguang"],
  ["pengdehuai", "彭德怀"],
  ["yangshangkun", "杨尚昆"],
  ["nongranzhai", "弄染"],
  ["zhenning", "镇宁县"],
  ["buyi_village", "Bouyei village Guizhou"],
  ["buyi", "Buyi people"],
  ["long_march_guizhou", "Long March Guizhou"],
  ["red_army", "Chinese Red Army Long March"],
  ["guiyang", "Guiyang"],
  ["archive_docs", "old archive documents"],
  ["memorial_hall", "revolution memorial hall China"],
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
    const search = await api({ action: "query", format: "json", list: "search", srnamespace: "6", srlimit: "8", srsearch: q });
    const hits = (search.query && search.query.search) || [];
    if (hits.length) {
      const titles = hits.map((h) => h.title).join("|");
      const info = await api({ action: "query", format: "json", prop: "imageinfo", iiprop: "url|mime|size|extmetadata", iiurlwidth: "1600", titles });
      const pages = Object.values(info.query.pages);
      for (const h of hits) {
        const page = pages.find((p) => p.title === h.title);
        const ii = page && page.imageinfo && page.imageinfo[0];
        out.push({
          label,
          title: h.title,
          mime: ii ? ii.mime : "",
          width: ii ? ii.width : "",
          height: ii ? ii.height : "",
          original: ii ? ii.url : "",
          thumburl: ii && ii.thumburl ? ii.thumburl : "",
          license: ii && ii.extmetadata && ii.extmetadata.LicenseShortName ? ii.extmetadata.LicenseShortName.value : "",
        });
      }
    }
  } catch (e) {
    out.push({ label, title: "ERROR", mime: String(e.message || e) });
  }
}

writeFileSync("tools/commons_results.json", JSON.stringify(out, null, 2), "utf8");
console.log("label\ttitle\tmime\tWxH\tlicense");
for (const r of out) {
  console.log([r.label, r.title, r.mime, r.width ? `${r.width}x${r.height}` : "", r.license].join("\t"));
}
