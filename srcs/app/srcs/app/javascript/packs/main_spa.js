import Backbone from "backbone";
import Users from "./models/users";
import HomeView from "./views/home";
import PongView from "./views/pong";
import SettingsView from "./views/settings";
import RoomsView from "./views/rooms";
import UsersView from "./views/users"
import AlertsView from "./views/alerts";
import AdminView from "./views/admin";
import GuildsView from "./views/guilds";
import pong_game from "./pong_game";
import MessagesView from "./views/messages";

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
        "users/:id/guild_invitations" : "guild_invitations",
        "admin(/)(/:section)"   : "admin",
        "users_not_in_guild"    : "guild_users_available",
        "guilds"                : "guilds",
        "guilds/:id"            : "guild_profile",
        "guilds/:id/requests"   : "guild_requests",
        "guilds/:id/members"    : "guild_members",
     //   "guilds/:id/edit"       : "guild_edit",
        ".*"                    : "pong" // 404???
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
    guilds: function () {
        this.main.view = new GuildsView.View();
        this.main.el.html(this.main.view.render().el);
    },
    guild_profile: function (id) {
        this.main.view = new GuildsView.ProfileView(id);
        this.main.el.html(this.main.view.el);
    },
    /*guild_edit: function (id) {
        this.main.view = new GuildsView.EditView(id);
        this.main.el.html(this.main.view.el);
    },*/
    guild_users_available: function () {
        this.main.view = new UsersView.AvailableForGuildView();
        this.main.el.html(this.main.view.render().el);
    },
    guild_members: function (id) {
        this.main.view = new UsersView.GuildMembersView(id);
        this.main.el.html(this.main.view.render().el);
    },
    guild_requests: function (id) {
        this.main.view = new UsersView.GuildRequestsView(id);
        this.main.el.html(this.main.view.render().el);
    },
    guild_invitations: function (id) {
        this.main.view = new GuildsView.GuildInvitationsView(id);
        this.main.el.html(this.main.view.render().el);
    },
    messages: function (id) {
        this.main.view = new MessagesView.View(id);
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
