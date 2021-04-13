import Backbone from "backbone";
import _ from "underscore";
import Rooms from "../models/rooms";

const RoomsView = {};


$(function () {
	RoomsView.RoomView = Backbone.View.extend({
        template: _.template($('#room-template').html()),
        events: {
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
        }
	 });


	RoomsView.View = Backbone.View.extend({
		initialize: function () {
			this.collection = new Rooms.RoomCollection;
			this.listenTo(this.collection, 'add', this.addOne);
		    this.listenTo(this.collection, 'reset', this.addAll);
			this.collection.fetch();
		},
		template: _.template($('#rooms-template').html()),
		events: {},
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
            room.view = new RoomsView.RoomView({model: room});
			console.log(room);
            this.$("#rooms").append(room.view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        }
	});
});

export default RoomsView;