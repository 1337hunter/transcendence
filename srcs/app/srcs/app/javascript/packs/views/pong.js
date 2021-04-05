import Backbone from "backbone";
import _ from "underscore";

const PongView = {};

$(function () {
	PongView.View = Backbone.View.extend({
		template: _.template($('#pong-template').html()),
		events: {},
		render: function () {
			this.$el.html(this.template());
			return this;
		}
	});
});

export default PongView;
