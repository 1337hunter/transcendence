import Backbone from "backbone";

const Admin = {};

Admin.UserModel = Backbone.Model.extend({
    urlRoot: '/api/admin/users'
});

Admin.UserCollection = Backbone.Collection.extend({
    model: Admin.UserModel,
    url: '/api/admin/users',
    comparator: 'id'
});

Admin.ChatModel = Backbone.Model.extend({
    urlRoot: '/api/admin/chats'
});

Admin.ChatCollection = Backbone.Collection.extend({
    model: Admin.ChatModel,
    url: '/api/admin/chats',
    comparator: 'id'
});

export default Admin;
