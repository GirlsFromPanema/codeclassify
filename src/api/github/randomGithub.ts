import axios from "axios";
import crypto from "crypto";

import { githubFilePaths as filePaths } from "../../structures/FilePaths";

interface GitHubFile {
  content: string;
}
interface GitHubApiResponse {
  data: GitHubFile;
}

const randomIndex: number = crypto.randomBytes(1)[0] % filePaths.length;
export const filePath = filePaths[randomIndex];

const accessToken = process.env.ACCESS_TOKEN;
const username = "vKxni"; // https://github.com/vKxni/codeclassify
const repo = "codeclassify";

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
