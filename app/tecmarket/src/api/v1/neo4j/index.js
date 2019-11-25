function Neo4jRoutes(server) {
  server.route(
    {
      method: 'GET',
      path: '/v1/neo4j/test',
      handler: async (request, reply) => {
        return '<h1>/v1/customers waiting </h1>';
      }
    },

    // -- New Customer -- //
    {
      method: 'POST',
      path: '/v1/neo4j/createProfile',
      handler: (request, reply) => {
        const {
          clientName,
          clientPassword,
          clientUser,
          clientBirthdate,
          clientEmail,
          clientSsn,
          clientPhone
        } = request.payload;
        const session = driver.session();
        return session
          .run(
            'MERGE (c:Client {name: $name, password: $password, user: $user, birthDate: $birthdate, email: $email, ' +
              'ssn: $ssn, phone: $phone}) RETURN c;',
            {
              name: clientName,
              password: clientPassword,
              user: clientUser,
              birthdate: clientBirthdate,
              email: clientEmail,
              ssn: clientSsn,
              phone: clientPhone
            }
          )
          .then(function(result) {
            let movarray = [];
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- New Supermarket -- //
    {
      method: 'GET',
      path: '/v1/neo4j/createSupermarket',
      handler: (request, reply) => {
        const {
          supermarketName,
          supermarketLatitud,
          supermarketLongitud,
          supermarketHorario,
          supermarketRating,
          supermarketDireccion,
          supermarketNumoforders,
          supermarketWebsite
        } = request.payload;
        const session = driver.session();
        return session
          .run(
            'MERGE (m:SuperMarket {name: $name, latitud: $latitud, longitud: $longitud, horario: $horario,' +
              'rating: $rating, direccion: $direccion, telefono: $telefono, numOfOrders: $numOfOrders, website: $website}) RETURN c;',
            {
              name: supermarketName,
              latitud: supermarketLatitud,
              longitud: supermarketLongitud,
              horario: supermarketHorario,
              rating: supermarketRating,
              direccion: supermarketDireccion,
              telefono: supermarketTelefono,
              numOfOrders: supermarketNumoforders,
              website: supermarketWebsite
            }
          )
          .then(function(result) {
            let movarray = [];
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- New Order -- //
    {
      method: 'GET',
      path: '/v1/neo4j/addOrder',
      handler: (request, reply) => {
        const {
          orderProduct,
          orderQuantity,
          orderState,
          orderPrice,
          orderDate,
          orderNecesity
        } = request.payload;

        const session = driver.session();
        return session
          .run(
            'MERGE (o:Pedido {product: $product, quantity: $quantity, state: $state, ' +
              'price: $price, date: $date, necesity: $necesity }) RETURN c;',
            {
              product: orderProduct,
              quantity: orderQuantity,
              state: orderState,
              price: orderPrice,
              date: orderDate,
              necesity: orderNecesity
            }
          )
          .then(function(result) {
            var movarray = [];
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- Relation Client-Order -- //
    {
      method: 'GET',
      path: '/v1/neo4j/clientOrderRelation',
      handler: (request, reply) => {
        var order_product = request.payload.order_product;
        var client_ssn = request.payload.order_ssn;
        const session = driver.session();
        return session
          .run(
            'MATCH (o:Pedido {product: $product})' +
              'MATCH (c:Client {ssn: $ssn}) ' +
              'CREATE (c)-[:ORDERED]->(o)',
            { product: order_product, ssn: client_ssn }
          )
          .then(function(result) {
            var movarray = [];

            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- Relation Order-Supermarket -- //
    {
      method: 'GET',
      path: '/MarketOrdeRelation',
      handler: (request, reply) => {
        const { orderProduct, supermarketName } = request.payload;
        //var order_product = request.payload.order_product;
        //var market_name = request.payload.market_name;
        const session = driver.session();
        return session
          .run(
            'MATCH (o:Pedido {product: $product})' +
              'MATCH (m:SuperMarket {name: $name}) ' +
              'CREATE (m)-[:IS_FROM]->(o)',
            { product: orderProduct, name: supermarketName }
          )
          .then(function(result) {
            var movarray = [];

            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- Get Client -- //
    {
      method: 'GET',
      path: '/GetClient',
      handler: (request, reply) => {
        const clientName = request.payload;
        const session = driver.session();
        return session
          .run('MATCH (c:Client {name: $name}) RETURN c;', {
            name: clientName
          })
          .then(function(result) {
            var movarray = [];
            result.records.forEach(function(record) {
              movarray.push({ Client_Name: record._fields[0].properties.name });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- Get specific Client and his History. -- //
    {
      method: 'GET',
      path: '/GetClientOrders',
      handler: (request, reply) => {
        const clientName = request.payload;
        const session = driver.session();

        return session
          .run(
            'MATCH (c:Client {name: $name})-[:ORDERED]->(p:Pedido) RETURN c,p;',
            { name: clientName }
          )
          .then(function(result) {
            var movarray = [];
            result.records.forEach(function(record) {
              movarray.push({
                Client_Name: record._fields[0].properties.name,
                Pedido: record._fields[1].properties.product
              });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- Get Supermakets with Orders. -- //
    {
      method: 'GET',
      path: '/GetSupermarket',
      handler: (request, reply) => {
        var supermarketName = request.payload;
        const session = driver.session();
        return session
          .run(
            'MATCH (c:Client {name: $name})-[:ORDERED]->(p:Pedido) MATCH (p)-[:IS_FROM]->(m:SuperMarket) RETURN m;',
            { name: supermarketName }
          )
          .then(function(result) {
            var movarray = [];
            result.records.forEach(function(record) {
              movarray.push({
                Super_Market: record._fields[0].properties.name
              });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- Top 5 of stores with most order. -- //
    {
      method: 'GET',
      path: '/GetTop5',
      handler: (request, reply) => {
        const session = driver.session();
        return session
          .run(
            'MATCH (s:SuperMarket) RETURN s.name,s.NumOfOrders ORDER BY s.NumOfOrders DESC LIMIT 5'
          )
          .then(function(result) {
            var movarray = [];
            result.records.forEach(function(record) {
              movarray.push({
                SuperMarket: record._fields[0],
                'Number of Orders': record._fields[1].low
              });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- Clients with Commons Orders in the same Supermarket. -- //
    {
      method: 'GET',
      path: '/GetCommonClients',
      handler: (request, reply) => {
        var clientName = request.payload;
        const session = driver.session();
        return session
          .run(
            'MATCH (c:Client {name:"Ash Ketchum"})-[:ORDERED]->(p:Pedido)' +
              'MATCH (p)-[:IS_FROM]->(m:SuperMarket)' +
              'MATCH (m)<-[:IS_FROM]-(p2:Pedido)' +
              'MATCH (c2:Client)-[:ORDERED]->(p2)' +
              'RETURN DISTINCT c2',
            { name: clientName }
          )
          .then(function(result) {
            var movarray = [];
            result.records.forEach(function(record) {
              movarray.push({ Client_Name: record._fields[0].properties.name });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // -- Suggetions of Commons Orders (by one client)  -- //
    {
      method: 'GET',
      path: '/GetRecommendedProducts',
      handler: (request, reply) => {
        const { clientName, supermaketName } = request.payload;
        /* var client_name = request.payload.client_name;
        var market_name = request.payload.market_name; */
        const session = driver.session();
        return session
          .run(
            'MATCH (c:Client {name: $clientName})-[:ORDERED]->(p:Pedido)' +
              'MATCH (p)-[:IS_FROM]->(m:SuperMarket {name: $marketName})' +
              'MATCH (m)<-[:IS_FROM]-(p2:Pedido)' +
              'MATCH (c2:Client)-[:ORDERED]->(p2)' +
              'MATCH (c2)-[:ORDERED]->(p3:Pedido)' +
              'RETURN DISTINCT p3, m',
            { clientName: clientName, marketName: supermaketName }
          )
          .then(function(result) {
            var movarray = [];
            result.records.forEach(function(record) {
              movarray.push({
                Super_Market: record._fields[1].properties.name,
                Product: record._fields[0].properties.product
              });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  );
}

export default Neo4jRoutes;
