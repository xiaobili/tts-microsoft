// 将播放音频包装成 promise
import { ChildProcess, exec } from "child_process";
import fs from "fs";
import request from "./axios";
import { getNowTime } from "./date";

const playMusic = (
  voice: string,
  selectedText: string,
  api: string,
  openDirectory: boolean,
  fileDir: string
): Promise<ChildProcess> => {
  return new Promise(async (resolve) => {
    const filePath = `${fileDir}/${getNowTime()}.mp3`;
    const template = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts"
                        xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
                        <voice name="${voice}">
                            <prosody rate="0%" pitch="0%">${selectedText}</prosody>
                        </voice>
                      </speak>`;

    const res = await request.post(api, template);
    const { data } = res;

    // 生成音频文件
    fs.writeFileSync(filePath, data);

    //打开音频文件所在目录
    if (openDirectory) {
      const openDir = exec(`open ${fileDir.replace(/ /g, "\\ ")}`);
      openDir.on("exit", () => {
        const play = exec(`afplay ${filePath.replace(/ /g, "\\ ")}`);
        resolve(play);
      });
    } else {
      const play = exec(`afplay ${filePath.replace(/ /g, "\\ ")}`);
      resolve(play);
    }
  });
};

export default playMusic;
