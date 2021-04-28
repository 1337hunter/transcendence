import Backbone from "backbone";

const Messages = {};


Messages.MessageModel = Backbone.Model.extend({
    idAttribute: 'id',
    urlRoot: '/api/messages'
});

Messages.MessageCollection = Backbone.Collection.extend({
    initialize: function(options) {
        this.id = options.id;
    },
    model: Messages.MessageModel,
    url: function () {
        return '/api/messages/' + this.id;
    },
    comparator: 'id'
});

export default Messages;