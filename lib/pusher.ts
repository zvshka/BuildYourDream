import Pusher from 'pusher';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var, vars-on-top
  var pusher: Pusher | undefined;
}

export const pusher =
  global.pusher ||
  new Pusher({
    appId: process.env.PUSHER_APPID || '',
    key: process.env.PUSHER_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: 'eu',
    useTLS: true,
  });

if (process.env.NODE_ENV !== 'production') global.pusher = pusher;
