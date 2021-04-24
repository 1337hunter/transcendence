import Backbone from "backbone";

const Admin = {};

Admin.UserModel = Backbone.Model.extend({
    urlRoot: '/api/users'
});

Admin.UserCollection = Backbone.Collection.extend({
    model: Admin.UserModel,
    url: '/api/admin/users',
    comparator: 'id'
});

export default Admin;
