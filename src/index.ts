import { config } from 'dotenv';
config();
import { initializeServices } from './services';

const main = async () => {
    await initializeServices();
}

main().catch(err => {
    console.error(err.stack);
    throw err;
});



