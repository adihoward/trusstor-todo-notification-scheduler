import { config } from 'dotenv';
config();

import { initializeServices } from './services';

try {
    initializeServices()
} catch (err) {
    console.error(err);
}


