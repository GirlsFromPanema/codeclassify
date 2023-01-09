import axios from "axios";
import crypto from "crypto";

const filePaths: string[] = [
  "Assembly/Source/Bot.cpp",
  "CPP/MyBot/MyBot.cpp",
  "Clojure/src/discord_bot/core.clj",
  "CoffeeScript/src/main.coffee",
  "Crystal/src/gembot/bot.cr",
  "Dart/lib/ping.dart",
  "D/source/app.d",
  "Elixir/lib/thonk/commands/helper.ex",
  "FSharp/FS.FinkSharp/BotCore.fs",
  "Gleam/bot.gleam",
  "Go/bot/bot.go",
  "Groovy/src/main.groovy",
  "Haskell/src/Gundyr.hs",
  "Haxe/bot.hx",
  "Java/src/main/java/org/botexample/DiscordBot.java",
  "JavaScript/src/index.js",
  "Julia/src/main.jl",
  "kotlin/template/App.kt",
  "Lua/basicdiscordbot.lua",
  "Nim/bot.nim",
  "PHP/src/Bot.php",
  "Pascal/discord.pas",
  "Perl/discord.pl",
  "Python/bot.py",
  "R/bot.R",
  "Ruby/lib/src/index.rb",
  "Rust/src/bot.rs",
  "Scala/bot/src/main/scala/science/wasabi/tini/bot/BotMain.scala",
  "Swift/Bot_teste/Sources/Bot/main.swift",
  "TypeScript/src/bot/client/Client.ts",
  "V/main.v",
  "Zig/src/main.zig",
  "CSharp/DiscordBotTemplate/Services/StartupService.cs",
];

const randomIndex = crypto.randomBytes(1)[0] % filePaths.length;
export const filePath = filePaths[randomIndex];

const accessToken = process.env.ACCESS_TOKEN;
const username = "vKxni"; // https://github.com/vKxni/hugediscord
const repo = "hugediscord";

export async function getFileCode() {
  const response = await axios.get(
    `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
    {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    }
  );
  const code = Buffer.from(response.data.content, "base64").toString("utf-8");
  const lines = code.split("\n");
  return lines.slice(0, 36);
}
