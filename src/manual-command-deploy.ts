import inquirer from "inquirer";

async function main() {
  const { guildId } = await inquirer.prompt([
    {
      type: "input",
      name: "guildId",
      message: "Enter the Guild ID where you want to deploy commands:",
    },
  ]);

  if (!guildId) {
    console.error("Guild ID is required!");
    return;
  }

  const { deployCommands } = await import("./deploy-commands");
  const status = await deployCommands({ guildId });

  if (status) {
    console.log("Commands deployed successfully!");
  } else {
    console.error("Failed to deploy commands.");
  }
}

main().then(() => {
  console.log("Manual command deployment completed.");
}).finally(() => {
  console.log("Exiting...");
})