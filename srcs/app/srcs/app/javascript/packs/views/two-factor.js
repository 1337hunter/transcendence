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
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch();
        },
        events: {
            "keypress .input-otp" : "inputOTP"
        },
        inputOTP: function (e) {
            if (e.keyCode !== 13) return;
            this.model.save({otp: this.input.val()},
                {success: this.onsuccess, error: this.onerror});
        },
        onsuccess: function (response) {
            Utils.app_alert('success', {json: response.responseJSON});
        },
        onerror: function (response) {
            if (response.responseJSON == null) //  true for undefined too
                Utils.app_alert('danger', {msg: 'No response from API'});
            else
                Utils.app_alert('danger', {json: response.responseJSON});
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.input-otp');
            return this;
        }
    });
});

export default TwoFactorView;
