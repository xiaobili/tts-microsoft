import axios from "axios";

const request = axios.create({
    baseURL: "http://192.168.5.145:1233/api",
    headers: {
        "Content-Type": "text/plain",
        "Format": "audio-24khz-48kbitrate-mono-mp3"
    },
    responseType: "arraybuffer"
});

export default request;