function Neo4jRoutes(server) {
  server.route(
    //-------------------------------------------------//
    //----------------------Create---------------------//
    //-------------------------------------------------//

    // -- New Client -- //
    {
      method: 'GET',
      path: '/Addclient',
      handler: (request, reply) => {
        const clientName = request.payload.clientName;
        const clientPassword = request.payload.clientPassword;
        const clientUser = request.payload.clientUser;
        const clientBirthdate = request.payload.clientBirthdate;
        const clientEmail = request.payload.clientEmail;
        const clientSsn = request.payload.clientSsn;
        const clientPhone = request.payload.clientPhone;
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
          .then(function (result) {
            let movarray = [];

            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },

    // -- New Supermarket -- //
    {
      method: 'GET',
      path: '/AddSupermarket',
      handler: (request, reply) => {
        const supermarketName = request.payload.supermarketName;
        const supermarketLatitud = request.payload.supermarketLatitud;
        const supermarketLongitud = request.payload.supermarketLongitud;
        const supermarketHorario = request.payload.supermarketHorario;
        const supermarketRating = request.payload.supermarketRating;
        const supermarketDireccion = request.payload.supermarketDireccion;
        const supermarketTelefono = request.payload.supermarketTelefono;
        const supermarketNumoforders = request.payload.supermarketNumoforders;
        const supermarketWebsite = request.payload.supermarketWebsite;
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
          .then(function (result) {
            let movarray = [];

            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },

    // -- New Order -- //
    {
      method: 'GET',
      path: '/AddOrder',
      handler: (request, reply) => {
        const orderProduct = request.payload.orderProduct;
        const orderQuantity = request.payload.orderQuantity;
        const orderState = request.payload.orderState;
        const orderPrice = request.payload.orderPrice;
        const orderDate = request.payload.orderDate;
        const orderNecesity = request.payload.orderNecesity;
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
          .then(function (result) {
            var movarray = [];

            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },

    //-------------------------------------------------//
    //--------------------Relation---------------------//
    //-------------------------------------------------//

    // -- Relation Client-Order -- //
    {
      method: 'GET',
      path: '/ClientOrderRelation',
      handler: (request, reply) => {
        var order_product = request.payload.order_product; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
        var client_ssn = request.payload.order_ssn;
        const session = driver.session();
        return session
          .run(
            'MATCH (o:Pedido {product: $product})' +
            'MATCH (c:Client {ssn: $ssn}) ' +
            'CREATE (c)-[:ORDERED]->(o)',
            { product: order_product, ssn: client_ssn }
          )
          .then(function (result) {
            var movarray = [];

            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },

    // -- Relation Order-Supermarket -- //
    {
      method: 'GET',
      path: '/MarketOrdeRelation',
      handler: (request, reply) => {
        var order_product = request.payload.order_product; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
        var market_name = request.payload.market_name;
        const session = driver.session();
        return session
          .run(
            'MATCH (o:Pedido {product: $product})' +
            'MATCH (m:SuperMarket {name: $name}) ' +
            'CREATE (m)-[:IS_FROM]->(o)',
            { product: order_product, name: market_name }
          )
          .then(function (result) {
            var movarray = [];

            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },
    //-------------------------------------------------//
    //---------------------Review----------------------//
    //-------------------------------------------------//

    // -- Get Client -- //
    {
      method: 'GET',
      path: '/GetClient',
      handler: (request, reply) => {
        var client_name = request.payload.client_name;
        const session = driver.session();
        return session
          .run('MATCH (c:Client {name: $name}) RETURN c;', {
            name: client_name
          })
          .then(function (result) {
            var movarray = [];
            result.records.forEach(function (record) {
              movarray.push({ Client_Name: record._fields[0].properties.name });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },

    // -- Get specific client and his history. -- //
    {
      method: 'GET',
      path: '/GetClientOrders',
      handler: (request, reply) => {
        var client_name = request.payload.client_name;
        const session = driver.session();

        return session
          .run(
            'MATCH (c:Client {name: $name})-[:ORDERED]->(p:Pedido) RETURN c,p;',
            { name: client_name }
          )
          .then(function (result) {
            var movarray = [];
            result.records.forEach(function (record) {
              movarray.push({
                Client_Name: record._fields[0].properties.name, //aqui es donde se sacan el valor de las "columnas" de
                Pedido: record._fields[1].properties.product
              }); //cada "tabla". el indice que dice 0 y 1 depende
              // de el orden de RETURN del query
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },

    // -- Get Supermakets with orders. -- //
    {
      method: 'GET',
      path: '/GetSupermarket',
      handler: (request, reply) => {
        var client_name = request.payload.client_name;
        const session = driver.session();
        return session
          .run(
            'MATCH (c:Client {name: $name})-[:ORDERED]->(p:Pedido) MATCH (p)-[:IS_FROM]->(m:SuperMarket) RETURN m;',
            { name: client_name }
          )
          .then(function (result) {
            var movarray = [];
            result.records.forEach(function (record) {
              movarray.push({
                Super_Market: record._fields[0].properties.name
              });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
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
          .then(function (result) {
            var movarray = [];
            result.records.forEach(function (record) {
              movarray.push({
                SuperMarket: record._fields[0],
                'Number of Orders': record._fields[1].low
              });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },

    // -- Clients with commons orders in the same store. -- //
    {
      method: 'GET',
      path: '/GetCommonClients',
      handler: (request, reply) => {
        var client_name = request.payload.client_name;
        const session = driver.session();
        return session
          .run(
            'MATCH (c:Client {name:"Ash Ketchum"})-[:ORDERED]->(p:Pedido)' +
            'MATCH (p)-[:IS_FROM]->(m:SuperMarket)' +
            'MATCH (m)<-[:IS_FROM]-(p2:Pedido)' +
            'MATCH (c2:Client)-[:ORDERED]->(p2)' +
            'RETURN DISTINCT c2',
            { name: client_name }
          )
          .then(function (result) {
            var movarray = [];
            result.records.forEach(function (record) {
              movarray.push({ Client_Name: record._fields[0].properties.name });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },

    // -- Suggetions of commons orders by one client  -- //
    {
      method: 'GET',
      path: '/GetRecommendedProducts',
      handler: (request, reply) => {
        var client_name = request.payload.client_name;
        var market_name = request.payload.market_name;
        const session = driver.session();
        return session
          .run(
            'MATCH (c:Client {name: $clientName})-[:ORDERED]->(p:Pedido)' +
            'MATCH (p)-[:IS_FROM]->(m:SuperMarket {name: $marketName})' +
            'MATCH (m)<-[:IS_FROM]-(p2:Pedido)' +
            'MATCH (c2:Client)-[:ORDERED]->(p2)' +
            'MATCH (c2)-[:ORDERED]->(p3:Pedido)' +
            'RETURN DISTINCT p3, m',
            { clientName: client_name, marketName: market_name }
          )
          .then(function (result) {
            var movarray = [];
            result.records.forEach(function (record) {
              movarray.push({
                Super_Market: record._fields[1].properties.name,
                Product: record._fields[0].properties.product
              });
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    }
  );
}
