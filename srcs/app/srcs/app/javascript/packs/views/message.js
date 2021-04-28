import Backbone from "backbone";
import _ from "underscore";
import Utils from "../helpers/utils";
import Messages from "../models/messages";

const MessagesView = {};

$(function () {
	MessagesView.View = Backbone.View.extend({
		template: _.template($('#message-template').html()),
        tagName: "p",
        initialize: function () {
        },
		events:{
		},
        render: function () {
			this.$el.html(this.template(this.model.toJSON()));
            return this;
		}
	});
});

export default MessagesView