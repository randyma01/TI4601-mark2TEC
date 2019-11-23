function Neo4jRoutes(server) {
  //-------------------------------------------------//
  //---------------------Reports---------------------//
  //-------------------------------------------------//

  // 1. -- Get Client -- //
  server.route(
    {
      method: 'GET',
      path: '/getClient',
      handler: (request, reply) => {
        var client_name = 'Ash Ketchum'; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
        const session = driver.session();
        return session
          .run('MATCH (c:Client {name: $name}) RETURN c;', {
            name: client_name
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

    // 2. -- Get specific client and his history. -- //
    {
      method: 'GET',
      path: '/getClientOrders',
      handler: (request, reply) => {
        var client_name = 'Ash Ketchum'; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
        const session = driver.session();

        // para acceder se usa la sesion que tiene la forma session.run().then().catch()
        return session // vvvvv eso de abajo es el nombre de la variable que se sustituye en el query
          .run(
            'MATCH (c:Client {name: $name})-[:ORDERED]->(p:Pedido) RETURN c,p;',
            { name: client_name }
          )
          .then(function(result) {
            //^^^  este es el orden de retorno del query
            var movarray = [];
            result.records.forEach(function(record) {
              movarray.push({
                Client_Name: record._fields[0].properties.name, //aqui es donde se sacan el valor de las "columnas" de
                Pedido: record._fields[1].properties.product
              }); //cada "tabla". el indice que dice 0 y 1 depende
              // de el orden de RETURN del query
            });
            console.log(movarray);
            return movarray;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },

    // 3. -- Top 5 of stores with most order. -- //
    {
      method: 'GET',
      path: '/getTop5',
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

    // 4. -- Clients with commons orders in the same store. -- //
    {
      method: 'GET',
      path: '/getCommonClients',
      handler: (request, reply) => {
        var client_name = 'Ash Ketchum'; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
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

    // 5. -- Suggetions of commons orders by one client  -- //
    {
      method: 'GET',
      path: '/getRecommendedProducts',
      handler: (request, reply) => {
        var client_name = 'Ash Ketchum'; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
        var market_name = 'Walmart Sanjose'; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
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
