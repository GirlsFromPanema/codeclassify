import chalk from "chalk";
import { ActivityType } from "discord.js";
import { ExtendedClient } from "../structures/Client";
import { BaseEvent } from "../structures/Event";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client: ExtendedClient) {
    console.log(chalk.green.bold.underline(`Logged in as ${client.user.tag}`));
    // client.user.setActivity({
    //   name: "Code",
    //   type: ActivityType.Listening,
    // });
    client.user.setStatus("dnd");
  }
}
