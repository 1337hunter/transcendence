import Backbone from "backbone";

const Wars = {};

Wars.WarModel = Backbone.Model.extend({
    urlRoot: '/api/wars'
});

Wars.WarCollection = Backbone.Collection.extend({
    model: Wars.WarModel,
    url: '/api/wars',
    comparator : function(model) {
        return [model.get('finished'), model.get('start')];
    }
});

export default Wars;