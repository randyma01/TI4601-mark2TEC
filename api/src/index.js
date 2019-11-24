import hapi from '@hapi/hapi';
import firebase from 'firebase/app';
import { v1 as neo4j } from 'neo4j-driver';
import 'firebase/auth';
import 'firebase/firestore';

import Neo4jRoutes from './api/v1/neo4j';
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
    firebase.initializeApp(firebaseConfig);
    CustomersRoutes(server, firebase);
    EmployeesRoutes(server, firebase);
    Neo4jRoutes(server);
    ServiceMapsRoutes(server);

    const driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'tecmarket')
    );

    const session = driver.session();

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
