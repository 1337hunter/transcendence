import Backbone from "backbone";
import _ from "underscore";
import Utils from "../helpers/utils";
import Messages from "../models/messages";
import Users from "../models/users";

const MessagesView = {};

$(function () {
	MessagesView.MessageView = Backbone.View.extend({
		template: _.template($('#message-template').html()),
		
		render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
	});

	MessagesView.View = Backbone.View.extend({
		template: _.template($('#messages-template').html()),
        tagName: "p",
        initialize: function (id) {
			this.id = id;
			this.listenTo(this.collection, 'add', this.addOne);
			this.collection = new Messages.MessageCollection({id: this.id});
        },
		events: {
			"keypress #chat-input" : "send_msg"
		},
        render: function () {
			this.$el.html(this.template());
			var $this = this;
			_.defer(function() {
  				$this.$('#chat-input').focus();
			});
			var $this = this;
			this.collection.fetch({
				success: function() {
					$this.addAll();
				}
			})
			return this;
		},
		addOne: function (msg) {
			var user_model = new Users.UserId({id: msg.get("user_id")});
			var $this = this;
			user_model.fetch({
				success: function() {
					msg.set({displayname: user_model.get("displayname")});
					msg.set({avatar: user_model.get("avatar_url")});
					msg.view = new MessagesView.MessageView({model: msg});
					$this.$("#messages").append(msg.view.render().el);
					$("#messages").scrollTop($("#messages")[0].scrollHeight);
					// $this.$("#messages").scrollTop = $this.$("#messages").scrollHeight;
				}
			})
		},
		addAll: function () {
			this.collection.each(this.addOne, this);
		},
		send_msg: function (e) {
			if (e.keyCode !== 13) return;

			let $this = this;
			var current_user = new Users.CurrentUserModel();
			current_user.fetch({
				success: function () {
					var mes = new Messages.MessageModel;
					mes.save({content: $('#chat-input').val().trim(), room_id: $this.id,
						user_id: current_user.get("id")}, {patch: true});
					mes.set({displayname: current_user.get("displayname")});
					mes.set({avatar: current_user.get("avatar_url")});
					var	mes_view = new MessagesView.MessageView({model: mes});
					$this.$("#messages").append(mes_view.render().el);
					$('#chat-input').val('');
				}
			}
			);
		}
	});
});

export default MessagesView