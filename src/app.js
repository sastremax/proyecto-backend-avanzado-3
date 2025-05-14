import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { logger } from './config/loggerEnvironment.js';

const numCPUs = cpus().length;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

logger.info(`Entering app.js - PID ${process.pid}`);

if (cluster.isPrimary) {
    const mode = process.argv[2] || 'dev';
    logger.info(`Primary PID ${process.pid} - Mode: ${mode}`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({ MODE: mode });
    }

    cluster.on('exit', (worker) => {
        logger.warning(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork({ MODE: mode });
    });

} else {
    process.argv[2] = process.env.MODE;
    const { default: runServer } = await import('./appServer.js');
    runServer();
}
