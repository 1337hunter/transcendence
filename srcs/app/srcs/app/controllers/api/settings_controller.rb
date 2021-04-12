class Api::SettingsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index
        @user = current_user
        respond_to do |format|
            format.json { render json: @user, :only =>
              [:id, :displayname, :email, :avatar_url, :avatar_default_url,
               :otp_required_for_login] }
        end
    end

    def update
        @user = current_user
        if (params.has_key?(:displayname))
            @user.update_attribute(:displayname, params[:displayname])
        end
        if (params.has_key?(:email))
            @user.update_attribute(:email, params[:email])
        end
        if (params.has_key?(:avatar_url))
            @user.update_attribute(:avatar_url, params[:avatar_url])
        end
        # notice! @user.update_attribute skips model validation
        # @user.save    # repeats transaction
    end
end
