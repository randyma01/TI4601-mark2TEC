import hapi from '@hapi/hapi';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const init = async () => {
  const server = hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: true
    }
  });

  const firebaseConfig = {
    apiKey: 'api-key',
    authDomain: 'project-id.firebaseapp.com',
    databaseURL: 'https://project-id.firebaseio.com',
    projectId: 'project-id',
    storageBucket: 'project-id.appspot.com',
    messagingSenderId: 'sender-id',
    appId: 'app-id',
    measurementId: 'G-measurement-id'
  };

  server.route({
    method: 'GET',
    path: '/hola/',
    handler: (request, h) => {
      return 'Hello World!';
    }
  });

  try {
    //firebase.initializeApp(firebaseConfig);

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
