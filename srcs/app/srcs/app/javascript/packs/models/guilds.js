import Backbone from "backbone";

const Guilds = {};

Guilds.GuildModel = Backbone.Model.extend({
    urlRoot: '/api/guilds',
    defaults: {
        place: 0,
        score: 0
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