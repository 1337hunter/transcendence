import Backbone from "backbone";
import MainSPA from "../main_spa";

const Pong = {};

Pong.MatchModel = Backbone.Model.extend({
    idAttribute: "id",
    url: function () {
        return '/api/users/' + MainSPA.SPA.router.currentuser.get('id') + '/matches/'
    }
});

export default Pong;