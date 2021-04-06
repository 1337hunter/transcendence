import Backbone from "backbone";
import UserCollection from "./models/users"
import PongView from "./views/pong";
import OauthView from "./views/oauth";
import UsersView from "./views/users"
import pong_game from "./pong_game";

let AppRouter = Backbone.Router.extend({
    initialize: function() {
        this.el = $("#app_main");
        this.userscollection = new UserCollection;
    },
    routes: {
        "oauth"     : "oauth",
        "index"     : "pong",
        "pong"      : "pong",
        "users"     : "users",
        ".*"        : "pong"
    },
    pong: function () {
        this.view = new PongView.View();
        this.el.html(this.view.render().el);
        pong_game();
    },
    oauth: function () {
        this.view = new OauthView.View();
        this.el.html(this.view.render().el);
    },
    users: function () {
        this.view = new UsersView.View({collection: this.userscollection});
        this.el.html(this.view.render().el);
    }
});

class MainSPA {
    constructor() {
        this.router = new AppRouter;
        console.log(this.router);
        if (Backbone.History.started === false) {
            Backbone.history.start();
        }
    }
}

export default MainSPA;
