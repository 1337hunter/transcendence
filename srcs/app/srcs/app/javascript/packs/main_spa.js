import Backbone from "backbone";
import PongView from "./views/pong";
import OauthView from "./views/oauth";
import pong_game from "./pong_game";

let AppRouter = Backbone.Router.extend({
    initialize: function() {
        this.el = $("#app_main");
        this.pong();
    },
    routes: {
        "oauth"     : "oauth",
        "index"     : "pong",
        "pong"      : "pong",
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
