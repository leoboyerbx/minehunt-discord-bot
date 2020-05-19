import {DetailedServer} from "../lib/minehut-api";
import {Channel, Client, Message, TextChannel, User} from 'discord.js'
import * as module from "module";

export default class DiscordBot {
    private mhServer: DetailedServer;
    private client: Client;

    constructor (mhServer: DetailedServer, discordClient: Client) {
        this.mhServer = mhServer
        this.client = discordClient
    }

    init () {
        if (this.client.user) {
            console.log(`Connecté en tant que ${this.client.user.tag}!`)
            this.client.user.setUsername("Le p'tit mineur")
                .then((user) => console.log(`My new username is ${user.username}`))
                .catch(console.error)
        }
    }

    command (msg: Message) {
        if (msg.channel.id === process.env.DISCORD_CHANNEL) {
            const command = msg.content.substr(1)
            switch (command) {
                case 'statut':
                case 'status':
                case 'etat':
                case 'état':
                case 'state':
                    this.status(msg.channel as TextChannel)
                    break
                case 'start':
                case 'démarrer':
                case 'demarrer':
                    this.start(msg.channel as TextChannel, msg)
                    break
                case 'stop':
                case 'arrêter':
                case 'arreter':
                    this.stop(msg.channel as TextChannel, msg)
                    break
                case 'help':
                case 'aide':
                    this.help(msg.channel as TextChannel)
                    break
                default:
                    msg.reply("Désolé, je n'ai pas compris ta commande `" + command + "`")
            }
        }
    }

    private help (channel: TextChannel) {
        channel.send(
`Ce bot permet de gérer le serveur Minecraft \`${this.mhServer.name}.minehut.gg\`.

Commandes disponibles:

  - :desktop: \`état\` ou \`state\`: connaître l'état actuel du serveur
  
  - :green_circle: \`start\` ou \`démarrer\`: démarrer le serveur
  
  - :red_circle: \`stop\` ou \`arrêter\`: arrêter le serveur
  
  - :question: \`help\` ou \`aide\`: afficher l'aide
  
  
  `)
    }

    private async status (channel: TextChannel) {
        const status = await this.mhServer.getStatus()
        let msg
        switch (status.status) {
            case 'SERVICE_OFFLINE':
                msg = "Le serveur est en hibernation. Tu peux le démarrer avec la commande `start` ou  `démarrer`"
                break
            case 'SERVICE_STARTING':
                msg = "Le serveur est en train de sortir d'hibernation. Il va bientôt démarrer."
                break
            case 'STARTING':
                msg = "Patience ! le serveur est en train de démarrer."
                break
            case 'ONLINE':
                msg = "Le serveur est actif ! Il est accessible à l'adresse `" + this.mhServer.name + ".minehut.gg`"
                break
            case 'OFFLINE':
                msg = "Le serveur est arrêté. Tu peux le démarrer avec la commande `start` ou  `démarrer`"
                break
            case 'STOPPING':
                msg = "Le serveur est en train de s'arrêter."
                break
            default:
                msg = `Le serveur est dans un état inconnu(\`${status.status}\`) :open_mouth:\nDemande de l'aide à Léo`
        }
        channel.send(msg)
    }
    private async start (channel: TextChannel, msgObj: Message|null = null) {
        const state = await this.mhServer.getStatus()
        if (state.status === 'SERVICE_OFFLINE') {
            await this.mhServer.start()
        } else {
            await this.mhServer.start(false)
        }
        channel.send('Démarrage du serveur en cours...')
        this.awaitForState('ONLINE').then(() => {
            const msg = "Le serveur a été démarré"
            if (msgObj) {
                msgObj.reply(msg + " à ta demande")
            } else {
                channel.send(msg)
            }
            channel.send("Vous pouvez vous connecter au serveur à l'adresse: `" + this.mhServer.name + ".minehut.gg`")
        })
    }
    private async stop (channel: TextChannel, msgObj: Message|null = null) {
        await this.mhServer.stop()
        channel.send('Arrêt du serveur en cours...')
        this.awaitForState('OFFLINE').then(() => {
            const msg = "Le serveur a été arrêté"
            if (msgObj) {
                msgObj.reply(msg + " à ta demande")
            } else {
                channel.send(msg)
            }
        })
    }

    private awaitForState (state: String) {
        return new Promise(resolve => {
            const fetchInterval = setInterval(async () => {
                const status = await this.mhServer.getStatus()
                if (status.status === state) {
                    clearInterval(fetchInterval)
                    resolve()
                }
            }, 2000)
        })
    }
}
