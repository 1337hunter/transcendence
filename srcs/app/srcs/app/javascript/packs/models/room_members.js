import Backbone from "backbone";

const RoomMembers = {};


RoomMembers.RoomMembersModel = Backbone.Model.extend({
    idAttribute: 'id',
    urlRoot: '/api/room_members'
});

RoomMembers.RoomMemmersID = Backbone.Model.extend({
    initialize: function(options) {
        this.id = options.id;
    },
    url: function () {
        return '/api/room_members/' + this.id;
    }
});

RoomMembers.RoomMembersCollection = Backbone.Collection.extend({
    model: RoomMembers.RoomMembersModel,
    url: '/api/room_members',
    comparator: 'id'
});

RoomMembers.Admin = Backbone.Model.extend({
    initialize: function(options) {
        this.id = options.id;
    },
    url: function () {
        return '/api/room_admins/' + this.id;
    }
});

export default RoomMembers;