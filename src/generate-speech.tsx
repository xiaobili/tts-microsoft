import { getSelectedText, showToast, Toast, showHUD, getPreferenceValues, Cache } from "@raycast/api";
import fs from "fs";
import { getNowTime } from "./utils/date";
import { ChildProcess, exec } from "child_process";
import request from "./utils/axios";

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

  const { voice, fileDirectory, openDirectory, api } = preferences;

  const template = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts"
                          xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
                          <voice name="${voice}">
                              <prosody rate="0%" pitch="0%">${selectedText}</prosody>
                          </voice>
                      </speak>`;

  await showToast(Toast.Style.Animated, "Generating  Voice...");

  const cache = new Cache();

  const nowTime = getNowTime();

  const fileName = `${nowTime}.mp3`;

  const filePath = `${fileDirectory}/${fileName}`;

  if (cache.get("playmusic")) {
    await showHUD("请先停止播放音频");
    return;
  } else {
    // 将播放音频包装成 promise
    const playMusic = (filePath: string): Promise<ChildProcess> => {
      return new Promise(async (resolve) => {
        const res = await request.post(api, template);
        const { data } = res;
        // 生成音频文件
        fs.writeFileSync(filePath, data);
        //打开音频文件所在目录
        if (openDirectory) {
          const fileDir = fileDirectory.replace(/ /g, "\\ ");
          exec(`open ${fileDir}`);
        }
        resolve(exec(`afplay ${filePath}`));
      });
    };
    const p = await playMusic(filePath);
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
