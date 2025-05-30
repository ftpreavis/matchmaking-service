const fastify = require('fastify')({ logger: true });
const metrics = require('fastify-metrics');
const axios = require('axios');

const baseUrl = 'http://db-service:3000/';

async function startServer() {
	await fastify.register(metrics, { endpoint: '/metrics' });

	fastify.get('/matches', async (req, res) => {
		try {
			const response = await axios.get(`${baseUrl}matches`);
			return res.send(response.data);
		} catch (err) {
			req.log.error(err.message);
			return res.code(500).send({ error: 'Failed to fetch matches from db-service' });
		}
	});

	fastify.get('/matches/:playerId', async (req, res) => {
		try {
			const response = await axios.get(`${baseUrl}matches/${req.params.playerId}`);
			return res.send(response.data);
		} catch (err) {
			req.log.error(err.message);
			return res.code(500).send({ error: 'Failed to fetch player matches from db-service' });
		}
	});

	fastify.post('/matches', async (req, res) => {
		try {
			const response = await axios.post(`${baseUrl}matches`, req.body);
			return res.code(201).send(response.data);
		} catch (err) {
			console.error('DB service error:', err.response?.data || err.message);
			return res.code(500).send({ error: 'Failed to create match in db-service' });
		}
	});

	fastify.listen({ host: '0.0.0.0', port: 3000 }, (err, addr) => {
		if (err) {
			fastify.log.error(err);
			process.exit(1);
		}
		console.log('Routes :\n' + fastify.printRoutes());
		console.log(`Server listening at ${addr}`);
	});
}

startServer();
