import Backbone from "backbone";
import Utils from "../helpers/utils";

const Guilds = {};

Guilds.GuildModel = Backbone.Model.extend({
    urlRoot: '/api/guilds',
    defaults: {
        place: 0,
        score: 0,
        anagram: ''
    }
});

Guilds.GuildCollection = Backbone.Collection.extend({
    model: Guilds.GuildModel,
    url: '/api/guilds',
    comparator : function(model) {
        return -model.get('score');
    }
});

export default Guilds;