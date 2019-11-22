import hapi from '@hapi/hapi';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import ServiceMapsRoutes from './api/v1/serviceMaps';
import CustomersRoutes from './api/v1/customers';
import EmployeesRoutes from './api/v1/employees';

const init = async () => {
  const server = hapi.server({
    port: 8080,
    host: 'localhost',
    routes: {
      cors: true
    }
  });

  const firebaseConfig = {
    apiKey: "AIzaSyC-9yROEjbC0dstjE1QbFnzrd_htE-wtsY",
    authDomain: "tecmarket-515f4.firebaseapp.com",
    databaseURL: "https://tecmarket-515f4.firebaseio.com",
    projectId: "tecmarket-515f4",
    storageBucket: "tecmarket-515f4.appspot.com",
    messagingSenderId: "744991314664",
    appId: "1:744991314664:web:310a6968047a06aa0c6f5d"
  };

  server.route({
    method: 'GET',
    path: '/hola/',
    handler: (request, h) => {
      return 'Hello World!';
    }
  });

  try {
    firebase.initializeApp(firebaseConfig);
    CustomersRoutes(server, firebase);
    EmployeesRoutes(server, firebase);
    ServiceMapsRoutes(server);

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
