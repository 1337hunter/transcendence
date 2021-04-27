import Backbone from "backbone";
import _ from "underscore";
import Rooms from "../models/rooms";
import Utils from "../helpers/utils";
import Messages from "../models/messages";
import MessagesView from "./message";

const RoomsView = {};


$(function () {
	RoomsView.RoomView = Backbone.View.extend({
        template: _.template($('#room-template').html()),
        events: {
			'click .room-click' : 'room_click',
        },
    	tagName: "div",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            // this.listenTo(this.model, 'destroy', this.remove);
            // this.listenTo(this.model, 'error', this.onerror);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
		room_click: function () {
			//console.log(this.model.get("id"));
		}
	 });

	RoomsView.View = Backbone.View.extend({
		initialize: function () {
			this.current_room = 0;
			this.messages = {};
			this.collection = new Rooms.RoomCollection;
			this.listenTo(this.collection, 'add', this.addOne);
		    //this.listenTo(this.collection, 'reset', this.addAll);
			this.collection.fetch();
		},
		template: _.template($('#rooms-template').html()),
		events: {
			'click #create-room-btn' : 'create_room',
			'click #send-msg-btn' : 'send_msg',
			'click .room-click' : 'room_click',
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
		room_click: function (e) {
			var regex = /\d+/g;
			var href = $(e.currentTarget).attr("href");
			this.current_room = parseInt(href.match(regex));
			console.log(this.messages);
			this.messages = new Messages.MessageCollection({id: this.current_room});
			this.messages.fetch();
			this.messages.each(this.addMessage, this);
			console.log(this.messages);
		},
		addMessage: function (msg) {
			msg.view = new MessagesView.View({model: msg});
			this.$("#messages").append(msg.view.render().el);
		},
		addOne: function (room) {
            room.view = new RoomsView.RoomView({model: room});
            this.$("#rooms").append(room.view.render().el);
        },
        addAll: function () {
			this.collection.each(this.addOne, this);
        },
		create_room: function () {
			var mod = new Rooms.RoomModel;
			var $this = this;
			if ($('#room-name').val().trim()) {
				this.collection.create({id: mod.cid, name: $('#room-name').val().trim(),
					password: $('#room-password').val().trim(), private: $('#is_private').prop("checked")}, {
						wait: true,
						success: function() {
							$this.collection.fetch({
								success: function() {
									$this.render();
								}
							})
						},
						error: function () {
							Utils.appAlert('danger', {msg: 'Can\'t create chat room'});
						}
			});
			}
		},
		send_msg: function () {
			console.log(this.current_room)
			var mes = new Messages.MessageModel;
			mes.save({content: $('#chat-input').val().trim()}, {patch: true});
		}
	});
});

export default RoomsView;
