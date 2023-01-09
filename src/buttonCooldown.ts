import { CommandInteraction, Snowflake } from "discord.js";
const buttonCooldown = new Set<string | Snowflake>();

export function buttonCldw(interaction: CommandInteraction, cooldown: number) {
  if (buttonCooldown.has(interaction.user.id)) {
    return interaction.reply({
      content: `<@${interaction.user.id}> du kannst dies nur alle paar Sekunden klicken.`,
      ephemeral: true,
    });
  }
  buttonCooldown.add(interaction.user.id);
  setTimeout(() => buttonCooldown.delete(interaction.user.id), cooldown);
}
