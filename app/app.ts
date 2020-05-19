import * as dotenv from "dotenv";
dotenv.config();

import { Minehut } from "./lib/minehut-api";
import Discord, {Message} from 'discord.js'
import DiscordBot from "./modules/DiscordBot";
const trigger = process.env.DISCORD_TRIGGER || '/';

(async () => {
    const minehut = new Minehut()
    await minehut.login(process.env.EMAIL|| '', process.env.PASSWORD || '')
    const mhServer = await minehut.servers.fetchOne(process.env.MINEHUT_SERVERID || '')
    const status = await mhServer.getStatus()
    console.log(status, mhServer.name)
    const discordClient = new Discord.Client()
    const bot = new DiscordBot(mhServer, discordClient)

    discordClient.on('ready', () => {
        bot.init()
    })
    discordClient.on('message', (msg: Message) => {
        if (msg.content.startsWith(trigger)) {
            bot.command(msg)
        }
    })

    discordClient.login(process.env.DISCORD_TOKEN)

})();
