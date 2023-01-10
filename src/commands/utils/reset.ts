import { Command } from "../../structures/Command";

import UserModel from "../../models/User";
import emojis from "../../styles/emojis";

export default new Command({
  name: "reset",
  description: "Removes all of your data",
  run: async ({ interaction, client }) => {
    const userQuery = await UserModel.findOne({ userID: interaction.user.id });

    if (!userQuery)
      return interaction.reply({
        content: `${emojis.error} | No data`,
        ephemeral: true,
      });

    userQuery.delete();

    return interaction.reply({
      content: `${emojis.success} | Successfully deleted your data`,
      ephemeral: true,
    });
  },
});
