class Api::SettingsController < ApplicationController
    def index
        @user = current_user
        respond_to do |format|
            format.json { render json: @user, :only => [:nickname, :email] }    
        end
    end
end
