import c from 'config'
import { Logger } from 'ts-logger'
import { Client } from 'discord.js'
import LogBotTagInformationFactory from './utils/LogBotTagInformationFactory'
import ModuleManager from './bot-modules/ModuleManager'
import settings from './settings/Settings'
import sleep from './utils/sleep'

export const client = new Client()
const moduleManager = ModuleManager.getInstance()
const botLogFactory = new LogBotTagInformationFactory(client)
const logger: Logger = new Logger('BakaEngine Bot Index', { useColor: true, useGlobalLogInformationFactories: true })
Logger.addGlobalLogInformationFactory(botLogFactory)

async function login() {
    logger.logInfo('Trying to log in...')
    const token = c.get<string>('discord.token')
    await client.login(token)
    logger.logSuccess(`Logged in!`)
}

async function reconnect() {
    try { await login() }
    catch (err) {
        logger.logError(err)
        logger.logInfo('Trying to reconnect in 30 seconds.')
        await sleep(30000)
        reconnect()
    }
}

async function init() {
    try {
        await login()
        moduleManager.setupModules(settings.modules)
    }
    catch (err) { logger.logError(err) }
}

client.on('error', err => logger.logError(err))
client.on('disconnect', _ => reconnect())
init()