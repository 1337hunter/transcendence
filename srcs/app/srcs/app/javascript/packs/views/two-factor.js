import Backbone from "backbone";
import _ from "underscore";
import Users from "../models/users";
import Utils from "../helpers/utils";

const TwoFactorView = {};

$(function () {
    TwoFactorView.View = Backbone.View.extend({
        template: _.template($('#settings-2fa-template').html()),
        initialize: function () {
            this.model = new Users.TwoFactorModel;
            Utils.app_alert('info', 'Initializing 2FA')
        }
    });
});
