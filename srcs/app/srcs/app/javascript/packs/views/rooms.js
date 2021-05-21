import Backbone from "backbone";
import _ from "underscore";
import Rooms from "../models/rooms";
import Utils from "../helpers/utils";
import Messages from "../models/messages";
import MessagesView from "./messages";
import Users from "../models/users";
import RoomMembers from "../models/room_members"

const RoomsView = {};


$(function () {
	RoomsView.RoomView = Backbone.View.extend({
        template: _.template($('#room-template').html()),
        events: {
        },
    	tagName: "div",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
	 });

	RoomsView.View = Backbone.View.extend({
		initialize: function (main) {
			this.rooms = new Rooms.RoomCollection;
			this.direct_rooms = new Rooms.DirectRoomCollection;
			this.listenTo(this.rooms, 'add', this.addOne);
			this.direct_rooms.fetch();
			this.rooms.fetch();
			this.main = main
		},
		template: _.template($('#rooms-template').html()),
		events: {
			'click #create-room-btn' 	: 'create_room',
			'click .room-click' 		: 'room_click',
			"keypress" 					: "check_keypress_event",
			'click #new_chat'			: "click_new_chat_btn",
			'click #new_message'		: "click_new_message_btn"
		},
		render: function () {
			this.$el.html(this.template());
			var $this = this;
			_.defer(function() {
  				$this.$('#chat-input').focus();
			});
			this.addAll();
			return this;
		},
		addOne: function (room) {
			// if (room.get("private") == true)
			// 	return ;
            room.view = new RoomsView.RoomView({model: room});
            this.$("#rooms").append(room.view.render().el);
        },
        addAll: function () {
			this.rooms.each(this.addOne, this);
        },
		room_click: function (e) {
			let regex =  /\d+/;
			let room_id = String(e.currentTarget)
			room_id = room_id.substr(room_id.length - 1)
			var room = this.rooms.where({id: Number(room_id)})[0]
			
			if (room.get("password") != "" && room.get("password") != null)
			{
				if ($("#input-room-password_" + room_id).css("display") == 'block')
				{
					$("#input-room-password_" + room_id).css("display", "none");
					return this;
				}
				for (let i = 1; i <= this.rooms.length; ++i)
					$("#input-room-password_" + String(i)).css("display", "none");
				$("#input-room-password_" + room_id).css("display", "block");
				$('#input-room-password_' + room_id).focus();
			}
			else
				this.render_messages(Number(room_id));
			return this;
		},
		check_keypress_event: function (e) {
			if (e.keyCode !== 13) return;

			let target = String(e.target.id);
			if (target.substr(0, target.length - 2) == 'input-room-password')
				this.verify_password(Number(target.substr(target.length - 1)))
			else if (target == 'room-name' || target == 'room-password')
				this.create_room();
			else if (target == 'nickname_input')
				this.create_direct_room();
		},
		verify_password: function (room_id) {
			var $this = this;
			this.rooms.fetch({
				success: function () {
					let password = $('#input-room-password_' + room_id).val();
					let room = $this.rooms.where({id: Number(room_id)})[0]
					if (room.get("password") == password) {
						$this.render_messages(room_id)
					}
					else {
						Utils.appAlert('danger', {msg: 'Wrong password'});
					}
				}
			})
		},
		click_new_chat_btn: function() {
			$("#new_message_input").css("display", "none");
			if ($(".new-chat-input").css("display") == 'none')
			{
				$(".new-chat-input").css("display", "block");
				this.$('#room-name').focus();
			}
			else
				$(".new-chat-input").css("display", "none");
		},
		click_new_message_btn: function () {
			$(".new-chat-input").css("display", "none");
			if ($("#new_message_input").css("display") == 'none')
			{
				$("#new_message_input").css("display", "block");
				this.$('#nickname_input').focus();
			}
			else
				$("#new_message_input").css("display", "none");
		},
		render_messages: function (room_id) {
			let view = new MessagesView.View(room_id);
			$(".app_main").html(view.render().el);
		},
		create_room: function () {
			var mod = new Rooms.RoomModel;
			var $this = this;
			if ($('#room-name').val().trim()) {
				this.rooms.create({
					id: mod.cid, 
					name: $('#room-name').val().trim(),
					password: $('#room-password').val().trim(),
					private: $('#private').prop("checked")
				}, {
						wait: true,
						success: function() {
							$this.rooms.fetch({
								success: function() {
									$this.render();
									$("#rooms").scrollTop($("#rooms")[0].scrollHeight);
								}
							})
						},
						error: function () {
							Utils.appAlert('danger', {msg: 'Can\'t create chat room'});
						}
			});
			}
		},
		create_direct_room: function () {
			var dr_model = new Rooms.DirectRoomModel;
			var nickname_input = $('#nickname_input').val().trim();
			if (nickname_input) {
				console.log(nickname_input)
				var user = new Users.UserId({id: nickname_input})
				user.fetch();
			}
			// $('#nickname_input').val('');
			// this.click_new_message_btn();
		},
		render_direct_messages: function () {

		}
	});
});

export default RoomsView;
