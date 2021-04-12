import Backbone from "backbone";

const Users = {};

Users.CurrentUserModel = Backbone.Model.extend({
    url: '/api/users/current'
});

Users.UserModel = Backbone.Model.extend({
    urlRoot: '/api/users'
});

Users.UserCollection = Backbone.Collection.extend({
    model: Users.UserModel,
    url: '/api/users',
    comparator: 'id'
});

export default Users;
