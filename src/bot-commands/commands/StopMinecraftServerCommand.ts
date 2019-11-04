import Command from "../meta/Command";
import { Logger } from "ts-logger";
import ActivatedCommand from "../../models/ActivatedCommand";
import MinecraftServerManager from "../../models/MinecraftServerManager";

export default class StopMinecraftServerCommand extends Command {

    private static logger: Logger = new Logger('StopMinecraft Command', { useColor: true, useGlobalLogInformationFactories: true })
 
    public readonly name: string = 'stop-minecraft'
    public readonly description: string = 'Stops the minecraft server if it is running currently.'

    public async execute(activatedCommand: ActivatedCommand): Promise<void> {
        try {
            const channel = activatedCommand.message.channel

            const serverManager = MinecraftServerManager.getInstance()
            const isStopped = serverManager.stopServer()
            const responseTxt = isStopped ? 
                `Stopping Server.` :
                `Server is already stopped. You can start it with \`!start-minecraft\`.`
            
            await channel.send(responseTxt)
            StopMinecraftServerCommand.logger.logSuccess('Stop Minecraft Server Command completed.')
        }
        catch (err) {
            StopMinecraftServerCommand.logger.logError(err)
            activatedCommand.message.channel.send('Something went wrong!')
        }
    }

}