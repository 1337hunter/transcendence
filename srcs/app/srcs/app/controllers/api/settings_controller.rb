class Api::SettingsController < ApplicationController
    include ApplicationHelper
    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!
    before_action :check_2fa
    before_action :sign_out_if_banned

    def index
        @user = current_user
        respond_to do |format|
            format.json { render json: @user, :only =>
              [:id, :displayname, :email, :avatar_url, :avatar_default_url] }
        end
    end

    def update
        @user = current_user
        if (params.has_key?(:displayname))
            @user.update(displayname: params[:displayname])
        end
        if (params.has_key?(:email))
            @user.update(email: params[:email])
        end
        if (params.has_key?(:avatar_url))
            @user.update(avatar_url: params[:avatar_url])
        end
        render json: @user, :only =>
          [:id, :displayname, :email, :avatar_url, :avatar_default_url]
        # notice! @user.update_attribute skips model validation
        # @user.save    # repeats transaction
    end
end
