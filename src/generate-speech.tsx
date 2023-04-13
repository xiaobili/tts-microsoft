import { getSelectedText, showToast, Toast, showHUD, getPreferenceValues, Cache } from "@raycast/api";
import playMusic from "./utils/playMusic";
interface Preferences {
  voice: string;
  fileDirectory: string;
  openDirectory: boolean;
  api: string;
}

export default async () => {
  const preferences: Preferences = getPreferenceValues();

  let selectedText;
  try {
    selectedText = await getSelectedText();
  } catch (e) {
    await showHUD("请确保您已选择要生成音频的文本");
    return;
  }
  const { voice, fileDirectory, api, openDirectory } = preferences;

  const cache = new Cache();

  if (cache.get("playmusic")) {
    await showHUD("请先停止播放音频");
    return;
  } else {
    await showToast(Toast.Style.Animated, "语音生成中...");
    const p = await playMusic(voice, selectedText, api, openDirectory, fileDirectory);
    cache.set("playmusic", p.pid?.toString() || "");
    console.log(cache.get("playmusic"));
    p.on("exit", () => {
      if (cache.get("playmusic")) {
        cache.remove("playmusic");
      }
      console.log("进程已退出");
    });
  }
  await showToast(Toast.Style.Success, "Generate Voice Success");
};
