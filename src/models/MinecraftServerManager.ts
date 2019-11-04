import { Logger } from "ts-logger"
import { spawn } from "child_process"

export default class MinecraftServerManager {

    private static logger: Logger = new Logger('Minecraft Server Manager', { useColor: true, useGlobalLogInformationFactories: true })
    private static _instance: MinecraftServerManager

    public static getInstance(): MinecraftServerManager {
        if (!this._instance)
            this._instance = new MinecraftServerManager()
        return this._instance
    }

    private _server: any = null

    private constructor() { }

    get isRunning(): boolean {
        return !!this._server
    }

    public startServer(): boolean {
        if (this.isRunning)
            return false

        const serverProcess = spawn('java', [
            '-Xmx1024M',
            '-Xms1024M',
            '-jar',
            'minecraft_server.jar',
            'nogui'
        ])
        // serverProcess.stdout.setEncoding('utf-8')
        // // @ts-ignore
        // serverProcess.stdin.setEncoding('utf-8')
        serverProcess.stdout.setEncoding('utf-8')
        serverProcess.stderr.setEncoding('utf-8')
        serverProcess.stdout.on('data', (text) => { MinecraftServerManager.logger.logDebug(text) })
        serverProcess.stdout.on('error', (err) => { MinecraftServerManager.logger.logError(err) })
        serverProcess.stderr.on('data', (text) => { MinecraftServerManager.logger.logDebug(text) })
        serverProcess.stderr.on('error', (err) => { MinecraftServerManager.logger.logError(err) })
        this._server = serverProcess
        MinecraftServerManager.logger.logSuccess('Minecraft Server started!')
        return true
    }

    public stopServer(): boolean {
        if (!this.isRunning)
            return false
            
        this._server.kill()
        this._server = null
        MinecraftServerManager.logger.logSuccess('Minecraft Server stopped!')
        return true
    }

}