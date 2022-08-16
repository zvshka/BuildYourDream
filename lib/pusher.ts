import Pusher from 'pusher';

// eslint-disable-next-line import/no-mutable-exports
let pusher: Pusher;
if (process.env.NODE_ENV === 'production') {
  pusher = new Pusher({
    appId: process.env.PUSHER_APPID || '',
    key: process.env.PUSHER_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: 'eu',
    useTLS: true,
  });
} else {
  // @ts-ignore
  if (!global.pusher) {
    // @ts-ignore
    global.pusher = new Pusher({
      appId: process.env.PUSHER_APPID || '',
      key: process.env.PUSHER_KEY || '',
      secret: process.env.PUSHER_SECRET || '',
      cluster: 'eu',
      useTLS: true,
    });
  }
  // @ts-ignore
  pusher = global.pusher;
}

export default pusher;
