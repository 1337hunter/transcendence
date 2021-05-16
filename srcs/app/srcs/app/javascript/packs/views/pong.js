import Backbone from "backbone";
import _ from "underscore";
import GameRoomInit from "../../channels/game_room_channel";
import {rightPadX, rightPadY} from "../../channels/game_room_channel";

const PongView = {};

$(function () {
	PongView.View = Backbone.View.extend({
		template: _.template($('#pong-template').html()),
		events: {},
		initialize: function () {
			this.room = GameRoomInit;
			this.cable = this.room.createGameRoom();
			this.cable.send({str: "test"});
		},
		render: function () {
			this.$el.html(this.template());
			return this;
		},
		broadcastData: function (x, y)
		{
			this.cable.send({x, y});
		},
		getRightPadX: function ()
		{
			console.log(rightPadX + '---' + rightPadY);
			return (rightPadX);
		},
		getRightPadY: function ()
		{
			return (rightPadY);
		}
	});
});

export default PongView;
