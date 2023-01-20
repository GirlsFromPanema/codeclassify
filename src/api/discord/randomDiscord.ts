import axios from "axios";
import crypto from "crypto";

import { discordFilePaths as filePaths } from "../../structures/FilePaths";

interface GitHubFile {
  content: string;
}
interface GitHubApiResponse {
  data: GitHubFile;
}

const randomIndex: number = crypto.randomInt(0, filePaths.length);
export const filePath = filePaths[randomIndex];

const accessToken = process.env.ACCESS_TOKEN;
const username = "vKxni"; // https://github.com/vKxni/hugediscord
const repo = "hugediscord";

export async function getFileCode() {
  const response: GitHubApiResponse = await axios.get(
    `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
    {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    }
  );
  const code = Buffer.from(response.data.content, "base64").toString("utf-8");
  const lines: string[] = code.split("\n");
  return lines.slice(0, 36);
}
