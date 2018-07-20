import request from 'superagent';
import Swagger from 'swagger-client';

export const REL_PATH = '/admin/';

const urls = {
  host: 'http://localhost:8000',
  metadata: '/admin/metadata/',
};

export default class Api {
  static fetchMetadata() {
    return request
      .get(urls.host + urls.metadata)
      .then(response => response.body);
  }

  static fetchResource(payload, client) {
    const { resourceName, query } = payload;
    return client.apis[resourceName]
      .list(query)
      .then(response => response.body);
  }

  static fetchResourceElement(payload, client) {
    const resource = payload.resourceName;
    const id = payload.resourceId;
    return client.apis[resource]
      .retrieve({ element_id: id })
      .then(response => response.body);
  }

  static fetchSwaggerSchema(schemaUrl) {
    return Swagger(urls.host + schemaUrl).then(client => client);
  }

  static submitResource(payload, client) {
    return client.apis[payload.resourceName]
      .create({}, { requestBody: payload.resourceData })
      .then(response => response.body)
      .catch(error => {
        throw Error(JSON.stringify(error.response.body));
      });
  }

  static updateResourceElement(payload, client) {
    const { resourceName, resourceId, resourceData } = payload;
    return client.apis[resourceName]
      .update({ element_id: resourceId }, { requestBody: resourceData })
      .then(response => response.body);
  }
}
