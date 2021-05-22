import Backbone from "backbone";
import _ from "underscore";
import Utils from "../helpers/utils";
import Messages from "../models/messages";
import Users from "../models/users";
import Rooms from "../models/rooms";
import MainSPA from "../main_spa";
import SubToChannel from "../../channels/chat_channel"
import SubToDirect from "../../channels/direct_channel"

const MessagesView = {};

$(function () {
	MessagesView.MessageView = Backbone.View.extend({
		template: _.template($('#message-template').html()),
		events: {
			"click .message" : "open_user_profile"
		},
		open_user_profile: function () {
			var $this = this;
			var u_id = $this.$('.message').attr("data-user-id");
			MainSPA.SPA.router.navigate("#/users/" + u_id);
		},
		render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
	});

	MessagesView.View = Backbone.View.extend({
		template: _.template($('#messages-template').html()),
        tagName: "p",
        initialize: function (id) {
			this.room_id = id;
			this.cable = SubToChannel.join(id);
			this.listenTo(this.collection, 'add', this.addOne);
			this.collection = new Messages.MessageCollection(null, {id: this.room_id});
			this.room_model = new Rooms.RoomId({id: this.room_id});
        },
		events: {
			"keypress #chat-input" : "send_msg",
		},
        render: function () {
			var $this = this;

			this.room_model.fetch({
				success: function () {
					$this.$("#room-name").html("#" + $this.room_model.attributes[0].name)
				}
			});
			this.$el.html(this.template(this.room_model.toJSON()));
			_.defer(function() {
  				$this.$('#chat-input').focus();
			});
			this.collection.fetch({
				success: function() {
					$this.addAll();
				}
			})
			return this;
		},
		addOne: function (msg) {
			msg.view = new MessagesView.MessageView({model: msg});
			this.$("#messages").append(msg.view.render().el);
			$("#messages").scrollTop($("#messages")[0].scrollHeight);
		},
		addAll: function () {
			this.collection.each(this.addOne, this);
		},
		send_msg: function (e) {
			if (e.keyCode !== 13) return;
			if ($('#chat-input').val().trim() === "") return;

			let $this = this;
			var current_user = new Users.CurrentUserModel();
			current_user.fetch({
				success: function () {
					var mes = new Messages.MessageModel;
					mes.save({content: $('#chat-input').val().trim(), room_id: $this.room_id,
						user_id: current_user.get("id")}, {patch: true});
					if ($this.room_model.attributes[0].private === true)
						mes.set({displayname: "anonimous"});
					else
						mes.set({displayname: current_user.get("displayname")});
					mes.set({avatar: current_user.get("avatar_url")});
					var	mes_view = new MessagesView.MessageView({model: mes});
					$("#messages").scrollTop($("#messages")[0].scrollHeight);
					$('#chat-input').val('');
				}
			}
			);
		}
	});

	MessagesView.DirectView = Backbone.View.extend({
		template: _.template($('#direct_messages_template').html()),
        tagName: "p",
        initialize: function (id) {
			this.room_id = id;
			this.cable = SubToDirect.join(id);
			this.listenTo(this.collection, 'add', this.addOne);
			this.collection = new Messages.DirectMessageCollection(null, {id: this.room_id});
			this.room_model = new Rooms.DirectRoomId({id: this.room_id});
			this.current_user = new Users.CurrentUserModel();
			this.current_user.fetch();
        },
		events: {
			"keypress #chat-input"	: "send_msg",
			"click .block_user"		: "block_user"
		},
        render: function () {
			var $this = this;

			this.room_model.fetch({
				success: function () {
					$this.$("#receiver_name").html("@" + $this.room_model.attributes.receiver_name)
				}
			});
			this.$el.html(this.template(this.room_model.toJSON()));
			_.defer(function() {
  				$this.$('#chat-input').focus();
			});
			this.collection.fetch({
				success: function() {
					$this.addAll();
				}
			})
			return this;
		},
		addOne: function (msg) {
			msg.view = new MessagesView.MessageView({model: msg});
			this.$("#messages").append(msg.view.render().el);
			$("#messages").scrollTop($("#messages")[0].scrollHeight);
		},
		addAll: function () {
			this.collection.each(this.addOne, this);
		},
		block_user: function () {
			if (confirm('Are you sure you want to save this thing into the database?')) {
				if (this.room_model.attributes.blocked1 != "")
					this.room_model.set("blocked1", String(this.current_user.attributes.id));
				else
					this.room_model.set("blocked2", String(this.current_user.attributes.id));
				this.room_model.save();
				window.history.back();
			}
		},
		send_msg: function (e) {
			if (e.keyCode !== 13) return;
			if ($('#chat-input').val().trim() === "") return;

			let $this = this;
			var current_user = new Users.CurrentUserModel();
			console.log("here")
			current_user.fetch({
				success: function () {
					var mes = new Messages.DirectMessageModel;
					mes.save({
						content: $('#chat-input').val().trim(),
						room_id: $this.room_id,
						user_id: current_user.get("id")
					}, {
						patch: true
					});
					mes.set({displayname: current_user.get("displayname")});
					mes.set({avatar: current_user.get("avatar_url")});
					var	mes_view = new MessagesView.MessageView({model: mes});
					$("#messages").scrollTop($("#messages")[0].scrollHeight);
					$('#chat-input').val('');
				}
			}
			);
		}
	});
	

});

export default MessagesView
