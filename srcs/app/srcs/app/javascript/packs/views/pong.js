import Backbone from "backbone";
import _ from "underscore";
import GameRoomInit from "../../channels/game_room_channel";
import {obtainedValues} from "../../channels/game_room_channel";
import consumer from "../../channels/consumer"
import Pong from "../models/pong";
import pong_game from "../pong_game";

const PongView = {};

$(function () {
	PongView.View = Backbone.View.extend({
		template: _.template($('#pong-template').html()),
		events: {},
		initialize: function (id) {
			consumer.subscriptions.subscriptions.forEach((subscription) => {
				let found = subscription.identifier.search("{\"channel\":\"GameRoomChannel\",\"match_id\":" + id + "}")
				if (found != -1)
					this.cable = subscription;
			} )
			this.model = new Pong.MatchModel(id);
			let $this = this;
			this.model.fetch({
				success: function () {
					$this.first_player_id = $this.model.attributes.first_player_id;
					$this.second_player_id = $this.model.attributes.second_player_id;
					console.log($this.model);
					console.log($this.first_player_id);
					console.log("!!!!!!");
					$this.render();
				}
			});
			console.log(this.cable);
		//	this.cable.send({hi: "YE BOI"});
		//	this.room = GameRoomInit;
		//	this.cable = this.room.createGameRoom();
		//	this.cable.send({str: "test"});
		},
	/*	get_first_player_id: function () {
			return this.model.attributes.first_player_id;
		},
		get_second_player_id: function () {
			return this.model.attributes._player_id;
		},
	*/
		render: function () {
			this.$el.html(this.template());
			pong_game(this);
			return this;
		},
		broadcastData: function (x1, y1, x2, y2)
		{
			this.cable.send({x1, y1, x2, y2});
		},
		broadcastAll: function (right, left)
		{
			this.cable.send({right: right, left: left});
		},
		broadcastRight: function (right)
		{
			this.cable.send({right: right});
		},
		broadcastLeft: function (left)
		{
			this.cable.send({left: left});
		},
		broadcastBall: function(pos)
		{
			this.cable.send({ball: pos})
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
		getBallX: function ()
		{
			return (obtainedValues.ballx);
		},
		getBallY: function ()
		{
			return (obtainedValues.bally);
		},
		getLeftPadY: function ()
		{
			return (obtainedValues.leftPadY);
		},
	});
});

export default PongView;
