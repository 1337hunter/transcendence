import Backbone from "backbone";
import _ from "underscore";
import Users from "../models/users";
import Utils from "../helpers/utils";

const TwoFactorView = {};

$(function () {
    TwoFactorView.View = Backbone.View.extend({
        template: _.template($('#settings-2fa-template').html()),
        initialize: function () {
            this.fetched = false;
            this.model = new Users.TwoFactorModel;
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch();
        },
        events: {
            "keypress .input-otp" : "inputOTP"
        },
        inputOTP: function (e) {
            if (e.keyCode !== 13) return;
            if (this.model.get('otp_required_for_login'))
                this.model.destroy({otp: this.input.val()},
                    {success: this.onsuccess, error: this.onerror});
            else
                this.model.save({otp: this.input.val()},
                    {success: this.onsuccess, error: this.onerror});
        },
        onsuccess: function (response) {
            if (this.model.get('otp_required_for_login'))
                Utils.app_alert('success', {msg: '2FA Disabled'});
            else
                Utils.app_alert('success', {msg: '2FA Enabled'});
        },
        onerror: function (response) {
            if (response.responseJSON == null) //  true for undefined too
                Utils.app_alert('danger', {msg: 'No response from API'});
            else
                Utils.app_alert('danger', {json: response.responseJSON});
        },
        render: function () {
            if (this.fetched) {
                this.$el.html(this.template(this.model.toJSON()));
                this.input = this.$('.input-otp');
            }
            this.fetched = true;
            return this;
        }
    });
});

export default TwoFactorView;
