import { getSelectedText, showToast, Toast, showHUD, getPreferenceValues, Cache } from "@raycast/api";
import playMusic from "./utils/playMusic";
interface Preferences {
  voice: string;
  style: string;
  fileDirectory: string;
  openDirectory: boolean;
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
  const { voice, style, fileDirectory, openDirectory } = preferences;

  const cache = new Cache();

  if (cache.get("playmusic")) {
    await showHUD("请先停止播放音频");
    return;
  } else {
    await showToast(Toast.Style.Animated, "语音生成中...");
    const p = await playMusic(voice, style, selectedText, "/speak", openDirectory, fileDirectory);
    if (p === 200) {
      await showToast(Toast.Style.Success, "语音生成完毕");
    } else if (p === 429) {
      await showHUD("请求过于频繁，请稍后再试");
      await showToast(Toast.Style.Failure, "请求过于频繁，请稍后再试");
    } else {
      await showHUD("请求失败，请稍后再试");
      await showToast(Toast.Style.Failure, "请求失败，请稍后再试");
    }
  }
};
