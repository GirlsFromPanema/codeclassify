import { Message, PermissionFlagsBits } from "discord.js";
import { ExtendedClient } from "../structures/Client";
import { BaseEvent } from "../structures/Event";
import { ExtendedButtonInteraction } from "../typings/Command";

export default class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }
  async run(_client: ExtendedClient, interaction: ExtendedButtonInteraction) {
    switch (interaction.customId) {
      case "delete-embed": {
        if (
          !interaction.member.permissions.has(
            PermissionFlagsBits.ManageMessages
          )
        )
          return interaction.reply({
            content: "You don't have the permissions to do this!",
            ephemeral: true,
          });

        return (interaction.message as Message).delete();
      }
    }
  }
}
