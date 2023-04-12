import { exec } from "child_process";
import { Cache, showHUD } from "@raycast/api";

export default async () => {
  const cache = new Cache();
  const playmusic: String | null = cache.get("playmusic") || null;
  console.log(playmusic);

  if (playmusic) {
    exec(`kill ${playmusic}`);
    cache.remove("playmusic");
    console.log("已停止播放音频");
    await showHUD("已停止播放音频");
  } else {
    console.log("没有正在播放的音频");
    await showHUD("没有正在播放的音频");
  }
};
