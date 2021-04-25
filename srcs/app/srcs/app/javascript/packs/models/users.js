import Backbone from "backbone";

const Users = {};

Users.CurrentUserModel = Backbone.Model.extend({
    url: '/api/users/current'
});

Users.TwoFactorModel = Backbone.Model.extend({
    url: '/api/settings/2fa'
});

Users.UserModel = Backbone.Model.extend({
    urlRoot: '/api/users',
    defaults: {
        //guild_id: 0,
        guild_master: false,
        guild_officer: false
    }
});

Users.UserCollection = Backbone.Collection.extend({
    model: Users.UserModel,
    url: '/api/users',
    comparator: 'id'
});

export default Users;
