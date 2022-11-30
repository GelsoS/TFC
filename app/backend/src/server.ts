import App from './app';
import 'dotenv/config';

new App().start(process.env.APP_PORT || 3001);
