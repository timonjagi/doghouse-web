import { Novu } from '@novu/api';

const novu = new Novu({
  secretKey: process.env.NOVU_SECRET_KEY!,
  apiUrl: process.env.NEXT_PUBLIC_NOVU_API_HOST,
});

export default novu;