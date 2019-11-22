function CustomersRoutes(server, firebase) {
  server.route([
    {
      method: 'GET',
      path: '/v1/customer/test',
      handler: async (request, reply) => {
        return '<h1>/v1/customers waiting </h1>';
      }
    },
    // 1.1 -- create a new customer -- //
    {
      method: 'POST',
      path: '/v1/customer/createProfile',
      handler: async (request, reply) => {
        try {
          const { birthday, email, identification, name, password, phone, username } = request.payload;
          const userUID = await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(response => {
              return response.user.uid
            })
            .catch(error => {
              console.log(`${error.code} - ${error.message}`)
              return '';
            });
          if (userUID !== '') {
            let result = await firebase.firestore().collection('users').doc(userUID).set({
              'birthday': birthday,
              'email': email,
              'identification': identification,
              'name': name,
              'phone': phone,
              'username': username,
              'role': 'customer'
            }).then(() => {
              return 'Document successfully written'
            });
            return reply.response({ 'result': userUID });
          } else {
            return reply.response({ 'result': 'Error add user' });
          }
        }
        catch (error) {
          return reply.response(error);
        }
      }
    },
    // 1.3 -- find a customer by id -- //
    {
      method: 'GET',
      path: '/v1/customer/myProfile/{id}',
      handler: async (request, reply) => {
        try {
          const customer = request.payload;
          return reply.response(result);
        }
        catch (error) {
          return reply.response(error).code(500);
        }
      }
    },
    // 1.4 -- remove a customer by id -- //
    {
      method: 'DELETE',
      path: '/v1/customer/deleteProfile/{id}',
      handler: async (request, reply) => {
        try {
          const personId = request.params.id;
          const customer = request.payload;
          return reply.response(result);
        }
        catch (error) {
          return reply.response(error).code(500);
        }
      }
    },
    //-------------------------------------------------//
    //---------------------Extras----------------------//
    //-------------------------------------------------//
    // ** -- all users login -- ** //
    {
      method: 'POST',
      path: '/v1/users/login',
      handler: async (request, reply) => {
        try {
          const { email, password } = request.payload;
          let id = await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(response => {
              return response.user.uid
            })
            .catch(error => {
              return '';
            });
          let role = await firebase.firestore().collection('users').doc(id).get()
            .then((doc) => {
              if (doc.exists) {
                return doc.data().role
              } else {
                return ''
              }
            })
          return reply.response({ 'id': id, 'role': role });
        }
        catch (error) {
          return reply.response({});
        }
      }
    }
  ]);
}


export default CustomersRoutes;
