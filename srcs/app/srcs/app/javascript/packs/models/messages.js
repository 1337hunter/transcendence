import Backbone from "backbone";

const Messages = {};


Messages.MessageModel = Backbone.Model.extend({
    idAttribute: 'id',
    urlRoot: '/api/messages'
});

Messages.MessageCollection = Backbone.Collection.extend({
    model: Messages.MessageModel,
    url: '/api/messages',
    comparator: 'id'
});

export default Messages;