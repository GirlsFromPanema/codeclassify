import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  Message,
  Snowflake,
} from "discord.js";

import { ExtendedClient } from "../../structures/Client";
import { BaseEvent } from "../../structures/Event";
import emojis from "../../styles/emojis";
import { ExtendedButtonInteraction } from "../../typings/Command";

import { getFileCode, filePath } from "../../api/discord/randomDiscord";
import { fileExtensionsToLanguages } from "../../extensions";

import UserModel from "../../models/User";

const buttonCooldown = new Set<number | Snowflake>();
const cooldown: number = 30000;

const panelRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("discord-api")
    .setLabel("Discord API")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(`${emojis.developer}`),

  new ButtonBuilder()
    .setCustomId("github-api")
    .setLabel("Random")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(`${emojis.role}`),

  new ButtonBuilder()
    .setCustomId("delete-embed")
    .setEmoji(`🗑️`)
    .setStyle(ButtonStyle.Danger)
);

export default class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }
  async run(_client: ExtendedClient, interaction: ExtendedButtonInteraction) {
    switch (interaction.customId) {
      case "discord-api": {
        const member = interaction.member as GuildMember;

        const panelEmbedMessage = interaction.message;

        interaction.reply({ content: "Game started!", ephemeral: true });

        if (buttonCooldown.has(interaction.user.id)) {
          return interaction.reply({
            content: `<@${interaction.user.id}> your are on cooldown (30s).`,
            ephemeral: true,
          });
        }
        buttonCooldown.add(interaction.user.id);
        setTimeout(() => buttonCooldown.delete(interaction.user.id), cooldown);

        const pendingEmbed = new EmbedBuilder()
          .setDescription(
            `${member} started Game mode: \`Discord\`, game begins in <t:${
              Math.floor(Date.now() / 1000) + 10
            }:R>`
          )
          .setColor("Green");

        const code = await getFileCode();
        const codeString = code.join("\n");

        const getFileExtension = filePath.split(".").pop();

        const guessEmbed = new EmbedBuilder()
          .setDescription(`\`\`\`${getFileExtension}\n${codeString}\n\`\`\``)
          .setFooter({ text: "Guess the language" })
          .setColor("Random");

        const pendingMessage = await panelEmbedMessage.edit({
          embeds: [pendingEmbed],
          components: [],
        });

        setTimeout(() => {
          pendingMessage.edit({ embeds: [guessEmbed], components: [] });
        }, 10000);

        const filter = (m: Message) => !m.author.bot;
        const collector = interaction.channel.createMessageCollector({
          filter,
          time: 30000,
        });

        collector.on("collect", async (message: Message) => {
          if (
            message.content === getFileExtension ||
            fileExtensionsToLanguages[getFileExtension].indexOf(message.content) !== -1
          ) {
            const userWhoGuessedIt = message.author;

            const userQuery = !(await UserModel.findOne({
              userID: userWhoGuessedIt.id,
            }))
              ? await new UserModel({
                  userID: userWhoGuessedIt.id,
                  guesses: 1,
                }).save()
              : await UserModel.findOneAndUpdate(
                  { userID: userWhoGuessedIt.id },
                  { $inc: { guesses: 1 } }
                );

            message.reply(
              `🎉 | Awesome! You guessed it right!\nYou now have \`${
                userQuery.guesses || 1
              }\` correct guesses!`
            );

            message.channel.send({
              content: "Wanna play another round?",
              components: [panelRow],
            });

            const doneEmbed = new EmbedBuilder()
              .setDescription(`${userWhoGuessedIt} guessed the language!`)
              .setFooter({
                text: "The code got removed to not spoiler other players.",
              })
              .setColor("Green");

            await pendingMessage.edit({
              embeds: [doneEmbed],
            });

            collector.stop("guessed");
          }
        });

        collector.on("end", async (collected, reason) => {
          const timeUpEmbed = new EmbedBuilder()
            .setDescription(
              `Nobody guessed it right, it was: ||\`${getFileExtension}\`||`
            )
            .setFooter({
              text: `Want to learn how detect them very easily? Run /guesses`,
            })
            .setColor("Red");
          if (reason === "time")
            await pendingMessage.edit({
              embeds: [timeUpEmbed],
              components: [panelRow],
            });

          return;
        });
      }
    }
  }
}
