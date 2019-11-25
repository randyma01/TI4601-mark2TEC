function EmployeesRoutes(server, firebase) {
  server.route([
    {
      method: 'GET',
      path: '/v1/employee/test',
      handler: async (request, reply) => {
        return '<h1>/v1/employees waiting </h1>';
      }
    },

    // -- New Supermarket -- //
    {
      method: 'POST',
      path: '/v1/employee/addSupermarket',
      handler: async (request, reply) => {
        try {
          const {
            address,
            description,
            latitude,
            longitude,
            name,
            phone,
            photo,
            rating,
            schedule,
            urlWebsite
          } = request.payload;
          let result = await firebase
            .firestore()
            .collection('supermarkets')
            .add({
              address: address,
              description: description,
              latitude: latitude,
              longitude: longitude,
              name: name,
              phone: phone,
              photo: photo,
              rating: rating,
              schedule: schedule,
              website: urlWebsite
            })
            .then(ref => {
              console.log('Added document with ID: ', ref.id);
              return ref.id;
            });
          //TODO - ADD Neo4j
          return reply.response({ result: result });
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- Get all Supermarkets -- //
    {
      method: 'GET',
      path: '/v1/employee/findAllSupermarkets',
      handler: async (request, reply) => {
        try {
          let supermarkets = [];
          await firebase
            .firestore()
            .collection('supermarkets')
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let data = doc.data();
                data['id'] = doc.id;
                supermarkets.push(data);
              });
            });
          return reply.response(supermarkets);
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- Update Supermarket -- //
    {
      method: 'PUT',
      path: '/v1/employee/editSupermarket',
      handler: async (request, reply) => {
        try {
          const {
            id,
            address,
            description,
            latitude,
            longitude,
            name,
            phone,
            photo,
            rating,
            schedule,
            urlWebsite
          } = request.payload;
          let result = await firebase
            .firestore()
            .collection('supermarkets')
            .doc(id)
            .set({
              address: address,
              description: description,
              latitude: latitude,
              longitude: longitude,
              name: name,
              phone: phone,
              photo: photo,
              rating: rating,
              schedule: schedule,
              website: urlWebsite
            })
            .then(() => {
              return 'update';
            });

          //TODO EDIT Neo4j
          return reply.response({ result: result });
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- Delete Supermarket --  //
    {
      method: 'DELETE',
      path: '/v1/employee/deleteSupermarkets/{id}',
      handler: async (request, reply) => {
        try {
          let id = request.params.id;
          let result = await firebase
            .firestore()
            .collection('supermarkets')
            .doc(id)
            .delete()
            .then(() => {
              return 'deleted';
            });
          //TODO DELETE Neo4j
          return reply.response({ result: result });
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- New Product -- //
    {
      method: 'POST',
      path: '/v1/employee/addProduct',
      handler: async (request, reply) => {
        try {
          const {
            code,
            description,
            name,
            photo,
            price,
            supermarketId
          } = request.payload;
          let result = await firebase
            .firestore()
            .collection('products')
            .doc(code)
            .set({
              code: code,
              description: description,
              name: name,
              photo: photo,
              price: price,
              supermarket: supermarketId
            })
            .then(() => {
              return 'add';
            });
          return reply.response({ result: result });
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    //  -- Get all Products --  //
    {
      method: 'GET',
      path: '/v1/employee/findAllProducts',
      handler: async (request, reply) => {
        try {
          let products = [];
          await firebase
            .firestore()
            .collection('products')
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                products.push(doc.data());
              });
            });
          return reply.response(products);
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- Get Products (by code) -- //
    {
      method: 'GET',
      path: '/v1/employee/findOneProduct/{code}',
      handler: async (request, reply) => {
        try {
          let code = request.params.code;
          let product = await firebase
            .firestore()
            .collection('products')
            .doc(code)
            .get()
            .then(doc => {
              if (!doc.exists) {
                console.log('No such document!');
              } else {
                console.log('Document data:', doc.data());
                return doc.data();
              }
            })
            .catch(err => {
              console.log('Error getting document', err);
            });

          return reply.response(product);
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- Update Product -- //
    {
      method: 'PUT',
      path: '/v1/employee/editProduct',
      handler: async (request, reply) => {
        try {
          const {
            code,
            description,
            name,
            photo,
            price,
            supermarketId
          } = request.payload;
          let result = await firebase
            .firestore()
            .collection('products')
            .doc(code)
            .set({
              code: code,
              description: description,
              name: name,
              photo: photo,
              price: price,
              supermarket: supermarketId
            })
            .then(() => {
              return 'update';
            });
          return reply.response({ result: result });
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- Delete Product -- //
    {
      method: 'DELETE',
      path: '/v1/employee/deleteProducts/{code}',
      handler: async (request, reply) => {
        try {
          let code = request.params.code;
          let result = await firebase
            .firestore()
            .collection('products')
            .doc(code)
            .delete()
            .then(() => {
              return 'deleted';
            });
          return reply.response({ result: result });
        } catch (error) {
          return reply.response(error);
        }
      }
    }
  ]);
}

export default EmployeesRoutes;
