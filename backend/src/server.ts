import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Register listeners, trigger, etc. here

fastify.get('/', async (request, reply) => {
  return { status: 'StellarFlow backend running' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 8000, host: '0.0.0.0' });
    console.log('Server listening on port 8000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
// ...existing code...