const googleMapsClient = require('@google/maps').createClient({
  key: 'API-KEY-MAPS',
  Promise: ''
});

function ServiceMapsRoutes(server) {
  server.route([
    // -- What is this? -- //
    {
      method: 'GET',
      path: '/v1/test/{id}',
      handler: async (request, reply) => {
        try {
          /*
          let { origin, destination } = request.payload;
           units: 'metric',
            origins: origin,//'9.9088785,-84.0852799',
            destinations: destination //'9.9041169,-84.0773472'
          */
          let id = request.params.id;
          let result = await googleMapsClient
            .placesNearby({
              location: '9.9088785,-84.0852799',
              radius: parseInt('1500'),
              type: ['restaurant', 'bar']
            })
            .asPromise()
            .then(response => {
              return response.json.results;
            })
            .catch(err => {
              console.log(err);
            });
          return reply.response(result);
        } catch (error) {
          return reply.response(error).code(500);
        }
      }
    },

    // -- What is this? 2 -- //
    {
      method: 'GET',
      path: '/v1/findPredictions/{address}',
      handler: async (request, reply) => {
        try {
          let address = request.params.address;
          let result = await googleMapsClient
            .placesAutoComplete({
              input: address
            })
            .asPromise()
            .then(response => {
              return response.json.predictions;
            })
            .catch(err => {
              console.log(err);
              return '';
            });
          return reply.response(result);
        } catch (error) {
          return reply.response(error).code(500);
        }
      }
    },

    // -- Get Supermarket (by id) -- //
    {
      method: 'GET',
      path: '/v1/findByAddress/{address}',
      handler: async (request, reply) => {
        try {
          let address = request.params.address;
          let result = await googleMapsClient
            .geocode({
              address: address
            })
            .asPromise()
            .then(response => {
              return response.json.results;
            })
            .catch(err => {
              console.log(err);
            });
          return reply.response(result);
        } catch (error) {
          return reply.response(error).code(500);
        }
      }
    },
    {
      method: 'POST',
      path: '/v1/findByLatLng',
      handler: async (request, reply) => {
        try {
          let { latitude, longitude } = request.payload;
          let result = await googleMapsClient
            .reverseGeocode({
              latlng: `${latitude},${longitude}`,
              location_type: 'GEOMETRIC_CENTER'
            })
            .asPromise()
            .then(response => {
              return response.json.results;
            })
            .catch(err => {
              console.log(err);
            });
          return reply.response(result);
        } catch (error) {
          return reply.response(error).code(500);
        }
      }
    },
    {
      method: 'GET',
      path: '/v1/detailPlace/{id}',
      handler: async (request, reply) => {
        try {
          let id = request.params.id;
          let result = await googleMapsClient
            .place({
              placeid: id,
              fields: [
                'adr_address',
                'geometry',
                'international_phone_number',
                'name',
                'opening_hours',
                'photo',
                'rating',
                'vicinity',
                'website'
              ]
            })
            .asPromise()
            .then(response => {
              return response.json.result;
            })
            .catch(err => {
              console.log(err);
            });
          return reply.response(result);
        } catch (error) {
          return reply.response(error).code(500);
        }
      }
    },
    {
      method: 'GET',
      path: '/v1/detailPlacePhoto/{reference}',
      handler: async (request, reply) => {
        try {
          let reference = request.params.reference;
          let result = await googleMapsClient
            .placesPhoto({
              photoreference: reference,
              maxheight: 1600
            })
            .asPromise()
            .then(response => {
              let urlPhoto =
                response.socket._host + response.socket._httpMessage.path;
              return urlPhoto;
            })
            .catch(err => {
              console.log(err);
            });
          return reply.response({ url: `https://${result}` });
        } catch (error) {
          return reply.response(error).code(500);
        }
      }
    },
    {
      method: 'POST',
      path: '/v1/findNearPlaces',
      handler: async (request, reply) => {
        try {
          let { location, type, radius } = request.payload;
          let resultNearby = await googleMapsClient
            .placesNearby({
              location: location,
              radius: parseInt(radius),
              type: type
            })
            .asPromise()
            .then(response => {
              return response.json.results;
            })
            .catch(err => {
              console.log(err);
            });
          return reply.response(resultNearby);
        } catch (error) {
          return reply.response(error).code(500);
        }
      }
    },
    {
      method: 'POST',
      path: '/v1/distancePlaceSupermarket',
      handler: async (request, reply) => {
        try {
          let { origins, destinations } = request.payload;
          let resultDistance = await googleMapsClient
            .distanceMatrix({
              origins: `${origins}`,
              units: 'metric',
              destinations: `place_id:${destinations}`
            })
            .asPromise()
            .then(response => {
              return response.json.rows[0].elements[0].distance.text;
            })
            .catch(err => {
              console.log(err);
            });
          return reply.response({ result: resultDistance });
        } catch (error) {
          return reply.response(error).code(500);
        }
      }
    }
  ]);
}

export default ServiceMapsRoutes;
