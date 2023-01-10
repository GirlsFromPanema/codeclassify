import { EmbedBuilder, ApplicationCommandOptionType, User } from "discord.js";
import { Command } from "../../structures/Command";
import UserModel from "../../models/User";

export default new Command({
  name: "info",
  description: "Info about a user or the leaderboard",
  options: [
    {
      name: "user",
      description: "Show info for a user",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Show info for a user",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "leaderboard",
      description: "Show the leaderboard",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async ({ interaction, client }) => {
    if (interaction.options.getSubcommand() === "user") {
      const user = interaction.options.getUser("user") || interaction.user;
      const userQuery = await UserModel.findOne({
        userID: user.id,
      });

      if (!userQuery)
        return interaction.reply({
          content: `User ${user.tag} has guesses yet!`,
          ephemeral: true,
        });

      const embed = new EmbedBuilder()
        .setTitle(user.tag)
        .setDescription(`Guesses: ${userQuery.guesses}`)
        .setColor("Random");

      interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.options.getSubcommand() === "leaderboard") {
      let leaderboard = "";
      const topFiveUsers = await UserModel.aggregate([
        { $sort: { guesses: -1 } },
        { $limit: 5 },
      ]);

      for (let i = 0; i < topFiveUsers.length; i++) {
        const userTag = (await client.users.fetch(topFiveUsers[i].userID))?.tag;
        let emoji;
        switch (i) {
          case 0:
            emoji = ":first_place: ";
            break;
          case 1:
            emoji = ":second_place: ";
            break;
          case 2:
            emoji = ":third_place: ";
            break;
          default:
            emoji = ":medal:";
        }
        leaderboard +=
          emoji +
          " " +
          userTag +
          " (" +
          topFiveUsers[i].guesses +
          " guesses)\n";
      }

      const embed = new EmbedBuilder()
        .setTitle("Leaderboard")
        .setDescription(leaderboard);
      await interaction.reply({
        embeds: [embed],
      });
    }
  },
});
