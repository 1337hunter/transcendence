import Backbone from "backbone";

//  need route for this url in routes.rb pointing to rails controller
let UserModel = Backbone.Model.extend({
    urlRoot: '/api/users'
});

let UserCollection = Backbone.Collection.extend({
    model: UserModel,
    url: '/api/users'
});

export default UserCollection;
