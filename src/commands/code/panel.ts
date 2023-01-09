import {
  ButtonBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  TextChannel,
} from "discord.js";
import { Command } from "../../structures/Command";

import emojis from "../../styles/emojis";

export default new Command({
  name: "panel",
  description: "Sends the code guessing panel",
  run: ({ interaction, client }) => {
    const panelEmbed = new EmbedBuilder()
      .setDescription(`Welcome to the Panel, choose a mode below!`)
      .setColor("Green")
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("discord-api")
        .setLabel("Discord API")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(`${emojis.developer}`),

      new ButtonBuilder()
        .setCustomId("github-api")
        .setLabel("Random")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(`${emojis.role}`)
    );

    interaction.reply({ content: "Done! Have fun.", ephemeral: true });

    (interaction.channel as TextChannel).send({
      embeds: [panelEmbed],
      components: [row],
    });
  },
});
