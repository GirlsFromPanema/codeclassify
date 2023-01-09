import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "guesses",
  description: "Tipps and tricks how to detect a language",
  run: ({ interaction, client }) => {
    
    const embed = new EmbedBuilder()
    .setDescription(`Since we don't have too much space here, lets move to the [GitHub README.md](https://github.com/vKxni/codeclassify/blob/master/README.md#how-do-you-detectguess-languages-correctly)`)

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
});
