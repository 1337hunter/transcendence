import Backbone from "backbone";

const Rooms = {};


Rooms.RoomModel = Backbone.Model.extend({
    idAttribute: 'id',
    urlRoot: '/api/rooms'
});

Rooms.RoomId = Backbone.Model.extend({
    initialize: function(options) {
        this.id = options.id;
    },
    url: function () {
        return '/api/rooms/' + this.id;
    }
});


Rooms.RoomCollection = Backbone.Collection.extend({
    model:      Rooms.RoomModel,
    url:        '/api/rooms',
    comparator: 'id'
});

Rooms.DirectRoomModel = Backbone.Model.extend({
    idAttribute:    'id',
    urlRoot:        '/api/direct_rooms'
});

Rooms.DirectRoomCollection = Backbone.Collection.extend({
    model:  Rooms.DirectRoomModel,
    url:    '/api/direct_rooms'
});

export default Rooms;