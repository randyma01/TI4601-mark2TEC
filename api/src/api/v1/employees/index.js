function EmployeesRoutes(server, firebase) {
  server.route([
    {
      method: 'GET',
      path: '/v1/employee/test',
      handler: async (request, reply) => {
        return '<h1>/v1/employees waiting </h1>';
      }
    },
    {
      method: 'POST',
      path: '/v1/employee/addSupermarket',
      handler: async (request, reply) => {
        try {
          const { address,
            description,
            latitude,
            longitude,
            name,
            phone,
            photo,
            rating,
            schedule,
            urlWebsite } = request.payload;
          let result = await firebase.firestore().collection('supermarkets').add({
            'address': address,
            'description': description,
            'latitude': latitude,
            'longitude': longitude,
            'name': name,
            'phone': phone,
            'photo': photo,
            'rating': rating,
            'schedule': schedule,
            'website': urlWebsite
          }).then(ref => {
            console.log('Added document with ID: ', ref.id);
            return ref.id
          });
          return reply.response({ 'result': result });
        }
        catch (error) {
          return reply.response(error);
        }
      }
    }

  ]);
}


export default EmployeesRoutes;
