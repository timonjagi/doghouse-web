import { Novu } from '@novu/api';
import { config } from 'dotenv';

config({ path: '.env.local' }); // or .env.local

const novu = new Novu({
  secretKey: process.env.NOVU_SECRET_KEY!,
});

export default novu;