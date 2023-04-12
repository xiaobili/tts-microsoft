import { getSelectedText, showToast, Toast, showHUD, getPreferenceValues } from "@raycast/api";
import fs from "fs";
import { getNowTime } from "./utils/date";
import { exec } from "child_process";
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
                      </speak>`
  
    await showToast(Toast.Style.Animated, "Generating  Voice...");
  
    const res = await request.post(api, template);
  
    const { data } = res;
  
    const nowTime = getNowTime();
  
    const fileName = `${nowTime}.mp3`;
  
    const filePath = `${fileDirectory}/${fileName}`;
  
    // 生成音频文件
    fs.writeFileSync(filePath, data);
  
    // 打开文件夹
    if (openDirectory) {
      exec(`open ${fileDirectory}`);
      exec(`afplay ${filePath}`);
    } else {
        exec(`afplay ${filePath}`);
    }
  
    await showToast(Toast.Style.Success, "Generate Voice Success");
  };
  