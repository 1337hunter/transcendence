import Backbone from "backbone";
import _ from "underscore";
import consumer from "../../channels/consumer"

const PongView = {};
var gameRoom = {};

$(function () {
	PongView.View = Backbone.View.extend({
		template: _.template($('#pong-template').html()),
		events: {},
		initialize: function () {
			gameRoom = consumer.subscriptions.create("GameRoomChannel", {
				connected() {
				  // Called when the subscription is ready for use on the server
				  console.log("Connected to game room channel");
				},
			  
				disconnected() {
				  // Called when the subscription has been terminated by the server
				},
			  
				received(data) {
					console.log('hi');
				  // Called when there's incoming data on the websocket for this channel
				}
			  });
		},
		render: function () {
			this.$el.html(this.template());
			return this;
		}
	});
});

export {gameRoom};
export default PongView;
