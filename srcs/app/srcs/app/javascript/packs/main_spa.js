import Backbone from "backbone";
import UserCollection from "./models/users"
import PongView from "./views/pong";
import OauthView from "./views/oauth";
import UsersView from "./views/users"
import HomeView from "./views/home";
import SettingsView from "./views/settings";
import SettingsModel from "./models/settings"
import pong_game from "./pong_game";

let AppRouter = Backbone.Router.extend({
    initialize: function() {
        this.el = $("#app_main");
        this.userscollection = new UserCollection;
        this.settings = new SettingsModel;
    },
    routes: {
        "oauth"     : "oauth",
        "index"     : "home",
        "play"      : "pong",
        "users"     : "users",
        "settings"  : "settings",
        ".*"        : "pong" // 404
    },
    home: function () {
        this.view = new HomeView.View();
        this.el.html(this.view.render().el);
    },
    pong: function () {
        this.view = new PongView.View();
        this.el.html(this.view.render().el);
        pong_game();
    },
    play: function () {
        this.view = new OauthView.View();
        this.el.html(this.view.render().el);
    },
    settings: function () {
        this.view = new SettingsView.View({model: this.settings});
//      this.el.html(this.view.render().el);
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
