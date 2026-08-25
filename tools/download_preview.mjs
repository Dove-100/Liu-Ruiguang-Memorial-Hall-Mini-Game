import { mkdirSync, writeFileSync } from "node:fs";
const UA = "CodexImageReplacer/1.0 (Wikimedia Commons image search; contact: none)";
const candidates = [
  ["luriguang", "File:Lu Ruiguang.jpg", 900],
  ["pengdehuai", "File:General Peng Dehuai.jpg", 900],
  ["yangshangkun", "File:Yang Shangkun 2.jpg", 900],
  ["prologue_calligraphy", "File:Four treasures of the study (chinese calligraphy set to the uninitiated), Gurgaon, near Delhi.jpg", 900],
  ["ch1_bouyei_1853", "File:Members of the Bouyei ethnic group in Zhenning, Guizhou (1853).jpg", 1200],
  ["ch2_zhenning_pano", "File:Panoramic view of Zhenning Buyei and Miao Autonomous County April 2020.jpg", 1600],
  ["ch3_redarmy_site", "File:Former site of the headquarters of the Fifth Army Corps of the Chinese Workers' and Peasants' Red Army.jpg", 1200],
  ["ch4_guizhou_landscape", "File:Landscape Scenery in Liupanshui, Guizhou, China.jpg", 1200],
  ["ch5_museum1", "File:Lu Ruiguang Memorial Museum, Picture1.jpg", 1200],
  ["prop_stone_village", "File:Shitoucun, Longtanzhen, Guizhou, China.jpg", 900],
  ["prop_museum8", "File:Lu Ruiguang Memorial Museum, Picture8.jpg", 1200],
  ["prop_bouyei_map", "File:Bouyei.png", 1200],
  ["ch1_bouyei_1902", "File:Bouyei people in 1902 (No.10026).jpg", 900],
  ["prologue_four_treasures", "File:Four treasures of the Study.jpg", 1200],
  ["ch3_flag", "File:Chinese Red Army's Flag at the Zunyi Conference Museum.jpg", 1200],
  ["ch4_guiyang_montage", "File:Guiyang montage 2019.png", 1200],
];
mkdirSync("tools/preview", { recursive: true });
for (const [name, title, width] of candidates) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title)}?width=${width}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = (res.headers.get("content-type") || "").includes("png") ? "png" : "jpg";
    writeFileSync(`tools/preview/${name}.${ext}`, buf);
    console.log(`OK ${name}.${ext} ${buf.length} bytes (${res.headers.get("content-type")})`);
  } catch (e) {
    console.log(`FAIL ${name}: ${e.message}`);
  }
}
