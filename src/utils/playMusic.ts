// 将播放音频包装成 promise
import { exec } from "child_process";
import fs from "fs";
import request from "./axios";
import { getNowTime } from "./date";
import { Cache } from "@raycast/api";

const playMusic = (
  voice: string,
  style: string,
  selectedText: string,
  api: string,
  openDirectory: boolean,
  fileDir: string
): Promise<Number> => {
  return new Promise(async (resolve) => {
    const filePath = `${fileDir}/${getNowTime()}.mp3`;
    const template = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
                          xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml"
                          xml:lang="zh-CN">
                          <voice name="zh-CN-XiaoxiaoNeural">
                              <mstts:express-as style="${style}">${selectedText}</mstts:express-as>
                          </voice>
                      </speak>`;

    const requestData = {
      ssml: template,
      ttsAudioFormat: "audio-24khz-48kbitrate-mono-mp3",
      offsetInPlainText: 0,
      lengthInPlainText: selectedText.length,
      properties: {
        SpeakTriggerSource: "AccTuningPagePlayButton",
      },
    };

    const res = await request.post(api, requestData);
    const { data } = res;

    // 生成音频文件
    fs.writeFileSync(filePath, data);

    const cache = new Cache();

    //打开音频文件所在目录
    if (openDirectory) {
      const openDir = exec(`open ${fileDir.replace(/ /g, "\\ ")}`);
      openDir.on("exit", () => {
        const play = exec(`afplay ${filePath.replace(/ /g, "\\ ")}`);
        cache.set("playmusic", play.pid?.toString() || "");
        play.on("exit", () => {
          if (cache.get("playmusic") === play.pid?.toString()) {
            cache.remove("playmusic");
            console.log("播放完毕");
            resolve(1);
          } else resolve(0);
        });
      });
    } else {
      const play = exec(`afplay ${filePath.replace(/ /g, "\\ ")}`);
      cache.set("playmusic", play.pid?.toString() || "");
      play.on("exit", () => {
        if (cache.get("playmusic") === play.pid?.toString()) {
          cache.remove("playmusic");
          console.log("播放完毕");
          resolve(1);
        } else resolve(0);
      });
    }
  });
};

export default playMusic;
