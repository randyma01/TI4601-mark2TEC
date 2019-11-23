'use strict';

//importar el api de neo4j
// en ese video se explica masomenos como se setea la vara
// https://www.youtube.com/watch?v=V8rxwhoxfDw

// para instalar el api es: npm install neo4j-driver

// esto es para importarlo
const neo4j = require('neo4j-driver').v1;




//se ocupa hacer este driver para la conexion.
//en donde dice basic lo que lleva es el nombre de usuario
//que por defecto es neo4j y el password que ese se pone
// cuando se crea la base.
//el puerto por defecto es 7678 creo, pero funciona 
//si se pone solo localhost por si no sirve con ese port.
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','tecmarket'));

// se debe crear una session para acceder a la base de datos
const session = driver.session();







const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });




    // obtener un cliente
    server.route(
        {
        method: 'GET',
        path: '/getclient',
        handler:  (request, reply) => {
                
            var client_name = "Ash Ketchum"; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
            const session = driver.session();
            return session
            .run('MATCH (c:Client {name: $name}) RETURN c;', { name: client_name })
            .then(function(result){
                var movarray = [];
                result.records.forEach(function(record){
                    
                    
                    movarray.push({Client_Name: record._fields[0].properties.name});
                    
                    
                    
                });
                console.log(movarray);
                return movarray;
            })
            .catch(function(err)
            {
              console.log(err);  
            });
            
            

        }
        });

        // agregar un cliente
        server.route(
        {
        method: 'GET',
        path: '/addclient',
        handler:  (request, reply) => {
                
            var client_name = ""; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
            var client_password = "";
            var client_user = "";
            var client_birthdate = "";
            var client_email = "";
            var client_ssn = "";
            var client_phone = "";
            const session = driver.session();
            return session
            .run('MERGE (c:Client {name: $name, password: $password, user: $user, birthDate: $birthdate, email: $email, ' 
                + 'ssn: $ssn, phone: $phone}) RETURN c;', 
                { name: client_name , password:client_password, user: client_user, birthdate:client_birthdate, email:client_email,
                  ssn: client_ssn, phone: client_phone})
            .then(function(result){
                var movarray = [];

                console.log(movarray);
                return movarray;
            })
            .catch(function(err)
            {
              console.log(err);  
            });
            
            

        }
        });



        // agregar una sucursal
        server.route(
        {
        method: 'GET',
        path: '/addsupermarket',
        handler:  (request, reply) => {
                
            var supermarket_name = ""; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
            var supermarket_latitud = "";
            var supermarket_longitud = "";
            var supermarket_horario = "";
            var supermarket_rating = "";
            var supermarket_direccion = "";
            var supermarket_telefono = "";
            var supermarket_numoforders = "";
            var supermarket_website = "";
            const session = driver.session();
            return session
            .run('MERGE (m:Client {name: $name, latitud: $latitud, longitud: $longitud, horario: $horario,'
                 + 'rating: $rating, direccion: $direccion, telefono: $telefono, numOfOrders: $numOfOrders, website: $website}) RETURN c;', 
            {name: supermarket_name, latitud: supermarket_latitud, longitud: supermarket_longitud, horario: supermarket_horario,
              rating: supermarket_rating, direccion: supermarket_direccion, telefono: supermarket_telefono, numOfOrders: supermarket_numoforders,
              website: supermarket_website })
            .then(function(result){
                var movarray = [];
               
                console.log(movarray);
                return movarray;
            })
            .catch(function(err)
            {
              console.log(err);  
            });
            
            

        }
        });



        //agregar un pedido
        server.route(
        {
        method: 'GET',
        path: '/addorder',
        handler:  (request, reply) => {
                
            var order_product = "";  // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
            var order_quantity = ""; 
            var order_state = ""; 
            var order_price = ""; 
            var order_date = ""; 
            var order_necesity = ""; 
            const session = driver.session();
            return session
            .run('MERGE (o:Order {product: $product, quantity: $quantity, state: $state, ' 
                + 'price: $price, date: $date, necesity: $necesity }) RETURN c;', 
                 { product: order_product, quantity: order_quantity, state: order_state, price: order_price,
                   date: order_date, necesity: order_necesity })
            .then(function(result){
                var movarray = [];
                
                console.log(movarray);
                return movarray;
            })
            .catch(function(err)
            {
              console.log(err);  
            });
            
            

        }
        });

        //relacionar un pedido con un cliente
        server.route(
            {
            method: 'GET',
            path: '/clientorderrelation',
            handler:  (request, reply) => {
                    
                var order_product = "";  // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
                var client_ssn = ""; 
                const session = driver.session();
                return session
                .run('MATCH (o:Order {product: $product})'
                    + 'MATCH (c:Client {ssn: $ssn}) '
                    + 'CREATE (c)-[:ORDERED]->(o)', 
                     { product: order_product, ssn: client_ssn,})
                .then(function(result){
                    var movarray = [];
                    
                    console.log(movarray);
                    return movarray;
                })
                .catch(function(err)
                {
                  console.log(err);  
                });
                
                
    
            }
            });


            //relacionar un pedido con una sucursal
            server.route(
            {
            method: 'GET',
            path: '/marketorderrelation',
            handler:  (request, reply) => {
                    
                var order_product = "";  // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
                var market_name = ""; 
                const session = driver.session();
                return session
                .run('MATCH (o:Order {product: $product})'
                    + 'MATCH (m:Market {name: $name}) '
                    + 'CREATE (m)-[:IS_FROM]->(o)', 
                     { product: order_product, name: market_name,})
                .then(function(result){
                    var movarray = [];
                    
                    console.log(movarray);
                    return movarray;
                })
                .catch(function(err)
                {
                  console.log(err);  
                });
                
                
    
            }
            });
            
            
        

        //buscar un cliente en particular 
        //y mostrar todo su historial de pedidos
        server.route({
        
            method: 'GET',
            path: '/getclientorders',
            handler:  (request, reply) => {
                
                var client_name = "Ash Ketchum"; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
                const session = driver.session();

                // para acceder se usa la sesion que tiene la forma session.run().then().catch()     
                return session                                                         // vvvvv eso de abajo es el nombre de la variable que se sustituye en el query
                .run('MATCH (c:Client {name: $name})-[:ORDERED]->(p:Pedido) RETURN c,p;', { name: client_name })
                .then(function(result){                                          //^^^  este es el orden de retorno del query
                    var movarray = [];
                    result.records.forEach(function(record){
                        
                        
                        movarray.push({Client_Name: record._fields[0].properties.name, //aqui es donde se sacan el valor de las "columnas" de
                                        Pedido: record._fields[1].properties.product});//cada "tabla". el indice que dice 0 y 1 depende 
                                                                                       // de el orden de RETURN del query
                        
                        
                    });
                    console.log(movarray);
                    return movarray;
                })
                .catch(function(err)
                {
                  console.log(err);  
                });
                
                
    
            }
    
    
        });

        // Ver todas las sucursales en las que los 
        //clientes han hecho pedidos
        server.route({
        
            method: 'GET',
            path: '/getbusiness',
            handler:  (request, reply) => {
                
                var client_name = "Ash Ketchum"; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
                const session = driver.session();
                return session
                .run('MATCH (c:Client {name: $name})-[:ORDERED]->(p:Pedido) MATCH (p)-[:IS_FROM]->(m:SuperMarket) RETURN m;', { name: client_name })
                .then(function(result){
                    var movarray = [];
                    result.records.forEach(function(record){
                        
                        
                        movarray.push({Super_Market: record._fields[0].properties.name});
                        
                        
                        
                    });
                    console.log(movarray);
                    return movarray;
                })
                .catch(function(err)
                {
                  console.log(err);  
                });
                
                
    
            }
    
    
        });

        //Ver las 5 sucursales para los que se 
        //han registrado más pedidos.
        server.route({
        
            method: 'GET',
            path: '/getfivebusiness',
            handler:  (request, reply) => {
                
                
                const session = driver.session();
                return session
                .run('MATCH (s:SuperMarket) RETURN s.name,s.NumOfOrders ORDER BY s.NumOfOrders DESC LIMIT 5')
                .then(function(result){
                    var movarray = [];
                    result.records.forEach(function(record){
                        
                        
                        movarray.push({SuperMarket: record._fields[0],
                                        'Number of Orders': record._fields[1].low});
                        
                        
                        
                    });
                    console.log(movarray);
                    return movarray;
                })
                .catch(function(err)
                {
                  console.log(err);  
                });
                
                
    
            }
    
    
        });


        //Dado un cliente en particular mostrar todos 
        //los demás clientes que hayan realizado al menos
        //un pedido en una sucursal en común con ese cliente.
        server.route({
        
            method: 'GET',
            path: '/getcommonclients',
            handler:  (request, reply) => {
                
                var client_name = "Ash Ketchum"; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
                const session = driver.session();
                return session
                .run('MATCH (c:Client {name:"Ash Ketchum"})-[:ORDERED]->(p:Pedido)'
                + 'MATCH (p)-[:IS_FROM]->(m:SuperMarket)'
                + 'MATCH (m)<-[:IS_FROM]-(p2:Pedido)'
                + 'MATCH (c2:Client)-[:ORDERED]->(p2)'
                + 'RETURN DISTINCT c2', { name: client_name })
                .then(function(result){
                    var movarray = [];
                    result.records.forEach(function(record){
                        
                        
                        movarray.push({Client_Name: record._fields[0].properties.name});
                        
                        
                        
                    });
                    console.log(movarray);
                    return movarray;
                })
                .catch(function(err)
                {
                  console.log(err);  
                });
                
                return "sirve";
    
            }
    
    
        });

        //Dado un cliente en particular mostrar todos los productos 
        //que han comprado otros clientes
        //en los supermercados donde ha comprado ese cliente, 
        //para mostrárselos como sugerencias
        //para próximas compras.
        server.route({
        
            method: 'GET',
            path: '/getrecommendedproducts',
            handler:  (request, reply) => {
                
                var client_name = "Ash Ketchum"; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
                var market_name = "Walmart Sanjose"; // nombre que se uso como ejemplo, aqui iria la variable que se ocupe
                const session = driver.session();
                return session
                .run('MATCH (c:Client {name: $clientName})-[:ORDERED]->(p:Pedido)'
                + 'MATCH (p)-[:IS_FROM]->(m:SuperMarket {name: $marketName})' 
                + 'MATCH (m)<-[:IS_FROM]-(p2:Pedido)'
                + 'MATCH (c2:Client)-[:ORDERED]->(p2)'
                + 'MATCH (c2)-[:ORDERED]->(p3:Pedido)'
                + 'RETURN DISTINCT p3, m', {clientName: client_name, marketName: market_name})
                .then(function(result){
                    var movarray = [];
                    result.records.forEach(function(record){
                        
                        
                        movarray.push({Super_Market: record._fields[1].properties.name, 
                                        Product: record._fields[0].properties.product});
                        
                        
                        
                    });
                    console.log(movarray);
                    return movarray;
                })
                .catch(function(err)
                {
                  console.log(err);  
                });
                
                return "sirve";
    
            }
    
    
        });





    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();