import Backbone from "backbone";
import _ from "underscore";

const OauthView = {};

$(function () {
    OauthView.View = Backbone.View.extend({
        template: _.template($('#oauth42-template').html()),
        events: {},
        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });
});

export default OauthView;
