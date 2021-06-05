import MainSPA from "../main_spa";
import {toString} from "underscore/modules/_setup";

export default class Utils {
    // replaces avatar with default from db
    // if default from db is unavailable - replaces to common default
    // if common default is unavailable - element is removed
    static replaceAvatar (elem, model) {
        if ($(elem).attr('src') === "/assets/avatar_default.jpg")
            $(elem).remove();
        else {
            let replacesrc = model.get('avatar_default_url');
            if ($(elem).attr('src') === replacesrc)
                replacesrc = "/assets/avatar_default.jpg";
            $(elem).attr("src", replacesrc);
        }
        return true;
    }

    static capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    static appAlert(type, options) {
        if (options['msg'])
            MainSPA.SPA.app_alerts.addOne(type, Utils.capitalizeFirstLetter(options['msg']));
        if (options['json'])
            Object.values(options['json']).forEach((val) =>
                val.toString().split(',').forEach((msg) =>
                    Utils.appAlert(type, {msg: msg})));
    };

    static alertOnAjaxError(response) {
        if (response.responseJSON == null)  //  true for undefined too
            Utils.appAlert('danger', {msg: 'No response from API'});
        else
            Utils.appAlert('danger', {json: response.responseJSON});
    }

    static ajax(url, http, data) {
        return new Promise(((resolve, reject) => {
            $.ajax(url, {
                type: http,
                data: data,
                headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')}
            }).done(resolve).fail(reject);
        }));
    }

    static getShortDate(s) {
        let date = new Date(s);
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear().toString().substring(2,5);
    }

    static getTime(s) {
        let date = new Date(s);
        return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    }

    static accept_guild_invite(guild_id, guild_name) {
        $.ajax({
            url: 'api/users/current/' + '/join_guild',
            type: 'PUT',
            data: `guild_id=${guild_id}`,
            success: () => {
                Utils.appAlert('success', {msg: guild_name + '\'s request accepted'});
                MainSPA.SPA.router.navigate("#/guilds/" + guild_id);
            },
            error: (response) => {
                Utils.alertOnAjaxError(response);
            }
        });
    }

    static decline_guild_invite(user_id, guild_id, msg) {
        $.ajax({
            url: '/api/users/' + user_id  + '/guild_invitations/' + guild_id,
            type: 'DELETE',
            success: () => {
                Utils.appAlert('success', {msg: msg});
            },
            error: (response) => {
                Utils.alertOnAjaxError(response);
            }
        });
    }

    static decline_join_guild_request(user_id, username) {
        $.ajax({
            url: 'api/users/' + user_id + '/leave_guild',
            type: 'PUT',
            success: () => {
                Utils.appAlert('success', {msg: username + '\'s request declined'});
            },
            error: (response) => {
                Utils.alertOnAjaxError(response);
            }
        });
    }

    static accept_join_guild_request(user_id, username) {
        $.ajax({
            url: 'api/users/' + user_id + '/join_guild',
            type: 'PUT',
            data: `guild_accepted=${true}`,
            success: () => {
                Utils.appAlert('success', {msg: username + '\'s request accepted'});
            },
            error: (response) => {
                Utils.alertOnAjaxError(response);
            }
        });
    }

    static has_guild_invitation(user_id, guild_id) {
        let response = $.ajax({
            url: '/api/users/' + user_id + '/guild_invitations/' + guild_id,
            type: 'GET',
            async: false,
        }).responseText;
        return response ? true : false;
    }

    static decline_war_invite(id, msg) {
        $.ajax({
            url: '/api/wars/' + id,
            type: 'DELETE',
            success: () => {
                Utils.appAlert('success', {msg: msg});
            },
            error: (response) => {
                Utils.alertOnAjaxError(response);
            }
        });
    }
}
