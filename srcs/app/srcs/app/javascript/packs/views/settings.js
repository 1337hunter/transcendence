import Backbone from "backbone";
import _ from "underscore";
import SettingsModel from "../models/settings";

const SettingsView = {};

$(function () {
	SettingsView.View = Backbone.View.extend({
		template: _.template($('#settings-template').html()),
		events:{
			'blur input#email' : 'input',
			'blur input#displayname' : 'input',
			'click .user_avatar' : 'update_avatar',
			'click .upload_user_avatar' : 'upload_avatar'
		},
		initialize: function () {
			this.model = new SettingsModel;
			this.fetched = false;
			this.listenTo(this.model, 'sync', this.onsync);
			this.model.fetch();
		},
		onsync: function () {
			this.fetched = true;
			this.render();
		},
		render: function () {
			if (this.fetched === true)
				this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		input: function (input)
		{
			this.model.save({displayname: $('#displayname').val().trim(), email: $('#email').val().trim()});
		},
		update_avatar: function () {
			$(".upload_user_avatar").click();
		},
		upload_avatar: function (event) {
			var input = $(".upload_user_avatar");
			var file = input.val();
			console.log(file);

			
		}
	});
});

export default SettingsView;
