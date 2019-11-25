function CustomersRoutes(server, firebase) {
  server.route([
    {
      method: 'GET',
      path: '/v1/customer/test',
      handler: async (request, reply) => {
        return '<h1>/v1/customers waiting </h1>';
      }
    },

    // -- New Customer -- //
    {
      method: 'POST',
      path: '/v1/customer/createProfile',
      handler: async (request, reply) => {
        try {
          const {
            birthday,
            email,
            identification,
            name,
            password,
            phone,
            username
          } = request.payload;
          const userUID = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(response => {
              return response.user.uid;
            })
            .catch(error => {
              console.log(`${error.code} - ${error.message}`);
              return '';
            });
          if (userUID !== '') {
            let result = await firebase
              .firestore()
              .collection('users')
              .doc(userUID)
              .set({
                birthday: birthday,
                email: email,
                identification: identification,
                name: name,
                phone: phone,
                username: username,
                role: 'customer'
              })
              .then(() => {
                return 'Document successfully written';
              });
            return reply.response({ result: userUID });
          } else {
            return reply.response({ result: 'Error add user' });
          }
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- Get a Customer (by id) -- //
    {
      method: 'GET',
      path: '/v1/customer/myProfile/{customer}',
      handler: async (request, reply) => {
        try {
          const id = request.params.customer;
          let customer = await firebase
            .firestore()
            .collection('users')
            .doc(id)
            .get()
            .then(doc => {
              if (doc.exists) {
                return doc.data();
              } else {
                return '';
              }
            });
          return reply.response(customer);
        } catch (error) {
          return reply.response(error).code(500);
        }
      }
    },

    // -- Update Customer --  //
    {
      method: 'PUT',
      path: '/v1/customer/editProfile',
      handler: async (request, reply) => {
        try {
          const {
            id,
            birthday,
            email,
            identification,
            name,
            phone,
            username
          } = request.payload;
          let result = await firebase
            .firestore()
            .collection('users')
            .doc(id)
            .set({
              birthday: birthday,
              email: email,
              identification: identification,
              name: name,
              phone: phone,
              username: username,
              role: 'customer'
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

    // -- Remove a Customer (by id) -- //
    {
      method: 'DELETE',
      path: '/v1/customer/deleteProfile/{id}',
      handler: async (request, reply) => {
        try {
          let id = request.params.id;
          let result = await firebase
            .firestore()
            .collection('users')
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

    //  -- New Order --  //
    {
      method: 'POST',
      path: '/v1/customer/addOrder',
      handler: async (request, reply) => {
        try {
          const {
            customer,
            products,
            supermarketId,
            totalAmount
          } = request.payload;
          let date = new Date().toLocaleString();
          let result = await firebase
            .firestore()
            .collection('orders')
            .add({
              customer: customer,
              products: products,
              supermarket: supermarketId,
              amount: totalAmount,
              date: date,
              state: 'Registered'
            })
            .then(ref => {
              console.log('Added document with ID: ', ref.id);
              return ref.id;
            });
          return reply.response({ result: result });
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- Get Orders (by customer) --  //
    {
      method: 'GET',
      path: '/v1/customer/viewOrder/{customer}',
      handler: async (request, reply) => {
        try {
          let customer = request.params.customer;
          let orders = [];
          await firebase
            .firestore()
            .collection('orders')
            .where('customer', '==', customer)
            .get()
            .then(snapshot => {
              if (snapshot.empty) {
                console.log('No matching documents.');
                return 'empty';
              }
              snapshot.forEach(doc => {
                orders.push(doc.data());
              });
            })
            .catch(err => {
              console.log('Error getting documents', err);
            });

          return reply.response(orders);
        } catch (error) {
          return reply.response(error);
        }
      }
    },

    // -- Login (all users) --  //
    {
      method: 'POST',
      path: '/v1/users/login',
      handler: async (request, reply) => {
        try {
          const { email, password } = request.payload;
          let id = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(response => {
              return response.user.uid;
            })
            .catch(error => {
              return '';
            });
          let role = await firebase
            .firestore()
            .collection('users')
            .doc(id)
            .get()
            .then(doc => {
              if (doc.exists) {
                return doc.data().role;
              } else {
                return '';
              }
            });
          return reply.response({ id: id, role: role });
        } catch (error) {
          return reply.response({});
        }
      }
    },

    // -- Get Products (by supermarket) -- //
    {
      method: 'GET',
      path: '/v1/customer/findProductBySupermarket/{id}',
      handler: async (request, reply) => {
        try {
          let id = request.params.id;
          let products = [];
          await firebase
            .firestore()
            .collection('products')
            .where('supermarket', '==', id)
            .get()
            .then(snapshot => {
              if (snapshot.empty) {
                console.log('No matching documents.');
                return 'empty';
              }
              snapshot.forEach(doc => {
                products.push(doc.data());
              });
            })
            .catch(err => {
              console.log('Error getting documents', err);
            });

          return reply.response(products);
        } catch (error) {
          return reply.response(error);
        }
      }
    }
  ]);
}

export default CustomersRoutes;
