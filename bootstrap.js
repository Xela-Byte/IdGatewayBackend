'use strict';
module.exports = (router, routes) => {
  router.use(`/`, routes); // Route all traffic with v1 endpoint.
  router.get('/', (_, response) => {
    response.status(200).json({ statusCode: 200, statusMessage: 'Success' }); // Response for home route
  });
};

