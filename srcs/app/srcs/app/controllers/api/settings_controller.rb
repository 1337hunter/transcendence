class Api::SettingsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index
        @user = current_user
        respond_to do |format|
            format.json { render json: @user, :only => [:id, :displayname, :email] }    
        end
    end

    def update
        @user = current_user
        @user.update_attribute(:displayname, params[:displayname])
        @user.update_attribute(:email, params[:email])
        @user.save
    end
end
