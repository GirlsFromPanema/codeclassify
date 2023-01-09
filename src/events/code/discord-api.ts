import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  Message,
  PermissionFlagsBits,
  PermissionsBitField,
  Snowflake,
} from "discord.js";

import { ExtendedClient } from "../../structures/Client";
import { BaseEvent } from "../../structures/Event";
import emojis from "../../styles/emojis";
import { ExtendedButtonInteraction } from "../../typings/Command";

import { getFileCode, filePath } from "../../api/discord/randomDiscord";

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

// if the user enters the full name, we also count it, e.g.: cpp => C++
const fileExtensionsToLanguages: { [fileExtension: string]: string } = {
  asm: "Assembly",
  c: "C",
  cpp: "C++",
  cs: "CSharp",
  clj: "Clojure",
  coffee: "CoffeeScript",
  cr: "Crystal",
  d: "D",
  dart: "Dart",
  ex: "Elixir",
  fs: "FSharp",
  gleam: "Gleam",
  groovy: "Groovy",
  hs: "Haskell",
  hx: "Haxe",
  java: "Java",
  js: "JavaScript",
  jl: "Julia",
  kt: "Kotlin",
  lua: "Lua",
  nim: "Nim",
  ocaml: "caml",
  php: "PHP",
  pas: "Pascal",
  pl: "Perl",
  t: "Perl",
  py: "Python",
  r: "R",
  rb: "Ruby",
  rs: "Rust",
  sc: "Scala",
  ts: "TypeScript",
  v: "V",
  zig: "Zig",
};

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
            content: `<@${interaction.user.id}> du kannst dies nur alle paar Sekunden klicken.`,
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
            message.content === fileExtensionsToLanguages[getFileExtension]
          ) {
            const userWhoGuessedIt = message.author;

            message.reply("🎉 | Awesome! You guessed it right!");

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
