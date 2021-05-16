import Backbone from "backbone";
import _ from "underscore";
import SubToGameChannel from "../../channels/game_room_channel";

const PongView = {};

$(function () {
	PongView.View = Backbone.View.extend({
		template: _.template($('#pong-template').html()),
		events: {},
		initialize: function () {
			this.cable = SubToGameChannel.join();
		},
		render: function () {
			this.$el.html(this.template());
			return this;
		}
	});
});

export default PongView;
