import Command from "../meta/Command";
import ActivatedCommand from "../../models/ActivatedCommand";
import { Logger } from "ts-logger";
import MinecraftServerManager from "../../models/MinecraftServerManager";
import ip from 'ip'
import settings from "../../settings/Settings";

export default class StartMinecraftServerCommand extends Command {

    private static logger: Logger = new Logger('StartMinecraft Command', { useColor: true, useGlobalLogInformationFactories: true })

    public readonly name: string = 'start-minecraft'
    public readonly description: string = 'Start the minecraft server if it isn\'t running already.'

    public async execute(activatedCommand: ActivatedCommand): Promise<void> {
        try {
            const channel = activatedCommand.message.channel

            if (!settings.usersWithMinecraftRights.includes(activatedCommand.message.member.id)) {
                channel.send('You don\'t have the rights to start the minecraft server!')
                return
            }

            let privateMode = true

            if (activatedCommand.args.length && 
                activatedCommand.args[0].toLowerCase() === 'public')
                privateMode = false
            
            const ipAdress = ip.address()

            const serverManager = MinecraftServerManager.getInstance()
            const isStarted = serverManager.startServer()
            const responseTxt = isStarted ? 
                `Starting ${privateMode ? 'local' : 'public'} server on \`${ipAdress}:25565\`!\nThis might take up to 30 seconds.` :
                `Server is already running on \`${ipAdress}:25565\`!`
            
            await channel.send(responseTxt)
            StartMinecraftServerCommand.logger.logSuccess('Start Minecraft Server Command completed!')
        }
        catch (err) {
            StartMinecraftServerCommand.logger.logError(err)
            activatedCommand.message.channel.send('Something went wrong!')
        }
    }

}