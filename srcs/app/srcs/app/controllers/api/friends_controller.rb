class Api::FriendsController < ApplicationController
    protect_from_forgery with: :null_session
    def add_friend
        current_user.request_friend(params[:user_id])
    end
end
