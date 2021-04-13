import Backbone from "backbone";
import _ from "underscore";
import SettingsModel from "../models/settings";
import TwoFactorView from "./two-factor";
import Utils from "../helpers/utils";

const SettingsView = {};

$(function () {
	SettingsView.View = Backbone.View.extend({
		template: _.template($('#settings-template').html()),
		events:{
			'blur input#email' : 'input_email',
			'blur input#displayname' : 'input_displayname',
			'blur input.upload_user_avatar' : 'update_avatar_close',
			'click .user_avatar' : 'update_avatar',
			'click #upload_user_avatar' : 'upload_avatar_url',
			'click #2fa-button' : 'open_2fa'
		},
		initialize: function () {
			this.model = new SettingsModel;
			this.listenTo(this.model, 'sync', this.render);
			this.model.fetch();
		},
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			let model = this.model;
			this.$('.user_avatar').on("error",
				function () { Utils.replaceavatar(this, model); });
			return this;
		},
		input_email: function (input)
		{
			this.model.save({email: $('#email').val().trim()}, {patch: true});
		},
		input_displayname: function (input)
		{
			this.model.save({displayname: $('#displayname').val().trim()}, {patch: true});
		},
		update_avatar: function () {
			this.$el.addClass('edit_url');
			$('.upload_user_avatar').focus();
		},
		update_avatar_close: function () {
			if ($('.upload_user_avatar').val().trim()) {
				this.model.save({avatar_url: $('.upload_user_avatar').val().trim()},
					{patch: true});
			}
			this.$el.removeClass('edit_url');
			this.render();
		},
		open_2fa: function () {
			if (this.otpview) {
				this.otpview.remove();
				this.otpview = null;
			}
			else {
				this.otpview = new TwoFactorView.View();
				this.$('.two-factor-body').html(this.otpview.el);
			}
		}
		/*upload_avatar: function (event) {
			var input = $("#upload_user_avatar");
			console.log(input);
			var data = new FormData();
			data.append('file', input[0].files[0]);
			console.log(data);
			if (data) {
				alert("name: " + data.name + "n" +"type: " + data.type + "n" +"size: " + data.size + " bytesn" + "starts with: " + contents);
				data.onload = function(e) {
					var contents = e.target.result;
				}

			}
			//data.append('file', picture);
			//this.model.save({displayname: $('#displayname').val().trim(), email: $('#email').val().trim(), avatar: data});
		}*/
	});
});

export default SettingsView;
