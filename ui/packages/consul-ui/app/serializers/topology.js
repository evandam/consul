import Serializer from './application';
import { PRIMARY_KEY, SLUG_KEY } from 'consul-ui/models/topology';

export default Serializer.extend({
  primaryKey: PRIMARY_KEY,
  slugKey: SLUG_KEY,
  respondForQueryRecord: function(respond, query) {
    const intentionSerializer = this.store.serializerFor('intention');
    return this._super(function(cb) {
      return respond(function(headers, body) {
        body.Downstreams.forEach(item => {
          item.Intention.SourceName = item.Name;
          item.Intention.SourceNS = item.Namespace;
          item.Intention.DestinationName = query.id;
          item.Intention.DestinationNS = query.ns || 'default';
          intentionSerializer.ensureID(item.Intention);
        });
        body.Upstreams.forEach(item => {
          item.Intention.SourceName = query.id;
          item.Intention.SourceNS = query.ns || 'default';
          item.Intention.DestinationName = item.Name;
          item.Intention.DestinationNS = item.Namespace;
          intentionSerializer.ensureID(item.Intention);
        });
        return cb(headers, {
          ...body,
          [SLUG_KEY]: query.id,
        });
      });
    }, query);
  },
});
