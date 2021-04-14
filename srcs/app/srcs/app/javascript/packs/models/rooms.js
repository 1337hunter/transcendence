import Backbone from "backbone";

const Rooms = {};


Rooms.RoomModel = Backbone.Model.extend({
    idAttribute: 'id',
    urlRoot: '/api/rooms'
});

Rooms.RoomCollection = Backbone.Collection.extend({
    model: Rooms.RoomModel,
    url: '/api/rooms',
    comparator: 'id'
});

export default Rooms;