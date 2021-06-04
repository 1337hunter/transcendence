import Backbone from "backbone";
import _ from "underscore";
import GameRoomInit from "../../channels/game_room_channel";
import {obtainedValues} from "../../channels/game_room_channel";

const PongView = {};

$(function () {
	PongView.View = Backbone.View.extend({
		template: _.template($('#pong-template').html()),
		events: {},
		initialize: function () {
		//	this.room = GameRoomInit;
		//	this.cable = this.room.createGameRoom();
		//	this.cable.send({str: "test"});
		},
		render: function () {
			this.$el.html(this.template());
			return this;
		},
		broadcastData: function (x1, y1, x2, y2)
		{
			this.cable.send({x1, y1, x2, y2});
		},
		getRightPadX: function ()
		{
			return (obtainedValues.rightPadX);
		},
		getRightPadY: function ()
		{
			return (obtainedValues.rightPadY);
		},
		getLeftPadX: function ()
		{
			return (obtainedValues.leftPadX);
		},
		getLeftPadY: function ()
		{
			return (obtainedValues.leftPadY);
		},
	});
});

export default PongView;
