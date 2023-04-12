import { exec } from "child_process";
import { Cache, showHUD } from "@raycast/api";

export default async () => {
  const cache = new Cache();
  const playmusic: String | null = cache.get("playmusic") || null;
  if (playmusic) {
    exec(`kill -15 ${playmusic}`);
    cache.remove("playmusic");
    await showHUD("音频已停止");
  } else {
    await showHUD("没有正在播放的音频");
  }
};
