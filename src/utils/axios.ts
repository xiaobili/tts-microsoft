import axios from "axios";

const request = axios.create({
    baseURL: "https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg",
    headers: {
        "Content-Type": "application/json",
        "Origin": "https://speech.microsoft.com",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    },
    responseType: "arraybuffer",
});

export default request;