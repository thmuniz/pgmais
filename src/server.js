import express from 'express'
import compression from 'compression'
import execute from './routes'
import bodyParser from 'body-parser'


class NodeServer {

	/**
	 * Retorna a instância do Express
	 */
	constructor() {
		this.app = express()

		 // Faz o compress do retorno utilizando gzip para perfomance
		this.app.use(compression())

		// Utilizado por ler requisições json
		// o limite é setado para permitir até 200mb de payload
		// a maioria dos uploads são enviados em base64
		this.app.use(bodyParser.json({ limit: '200mb' }))
		this.app.use(bodyParser.urlencoded({ extended: false, limit: '200mb' }))

		 // Define a porta que será usada através de variável de ambiente, caso não tenha utilizará o fallback 8000
		this.configs = {
			get port() {
				return  process.env.PGMAIS_SERVER_PORT || 8000
			}
		}
	}

	/**
	 * Executa e inicia a escuta por requisições
	 */
	run() {
		const server = this.app.listen(this.configs.port, () => {
			console.log("Server running on port " + this.configs.port + ".")
			console.log(`Environment: ${process.env.STAGE || "development"}`)
		})
		let router = execute(this.app)
	}
}

// Roda o server
new NodeServer().run()