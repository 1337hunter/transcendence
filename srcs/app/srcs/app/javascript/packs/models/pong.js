import Backbone from "backbone";
import MainSPA from "../main_spa";

const Pong = {};

Pong.MatchModel = Backbone.Model.extend({
    initialize: function (id) {
        this.id = id;
    },
    idAttribute: "id",
    url: function () {
        return '/api/users/' + MainSPA.SPA.router.currentuser.get('id') + '/matches/' + this.id
    }
});

export default Pong;