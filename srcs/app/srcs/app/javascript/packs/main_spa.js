import Backbone from "backbone";
import Users from "./models/users";
import HomeView from "./views/home";
import PongView from "./views/pong";
import SettingsView from "./views/settings";
import RoomsView from "./views/rooms";
import UsersView from "./views/users"
import AlertsView from "./views/alerts";
import AdminView from "./views/admin";
import pong_game from "./pong_game";
import "channels"

const MainSPA = {};

let AppRouter = Backbone.Router.extend({
    initialize: function() {
        //  this can be useful if we want to make navbar update on any settings change
        this.currentuser = new Users.CurrentUserModel;
        this.currentuser.fetch();

        this.main = {};
        this.main.el = $(".app_main");
    },
    routes: {
        ""                      : "home",
        "index"                 : "home",
        "oauth"                 : "oauth",
        "play"                  : "pong",
        "rooms"                 : "rooms",
        "settings"              : "settings",
        "users"                 : "users",
        "users/:id"             : "profile",
        "admin(/)(/:section)"   : "admin",
        ".*"                    : "pong" // 404?
    },
    home: function () {
        this.main.view = new HomeView.View();
        this.main.el.html(this.main.view.render().el);
    },
    pong: function () {
        this.main.view = new PongView.View();
        this.main.el.html(this.main.view.render().el);
        pong_game(this.main.view);
    },
    settings: function () {
        this.main.view = new SettingsView.View();
        this.main.el.html(this.main.view.el);
    },
    rooms: function () {
        this.main.view = new RoomsView.View();
        this.main.el.html(this.main.view.render().el);
    },
    users: function () {
        this.main.view = new UsersView.View();
        this.main.el.html(this.main.view.render().el);
    },
    profile: function (id) {
        this.main.view = new UsersView.ProfileView(id);
        this.main.el.html(this.main.view.el);
    },
    admin: function (section) {
        if (!(this.main.view instanceof AdminView.View)) {
            this.main.view = new AdminView.View();
            this.main.el.html(this.main.view.render().el);
        }
        this.main.view.rendercontent(section);
    }
});

class BackboneSPA {
    constructor() {
        this.app_alerts = new AlertsView.View;
        this.router = new AppRouter;
        if (Backbone.History.started === false) {
            Backbone.history.start();
        }
    }
}

// load on DOM ready
$(function () {
    MainSPA.SPA = new BackboneSPA;
});

export default MainSPA;
