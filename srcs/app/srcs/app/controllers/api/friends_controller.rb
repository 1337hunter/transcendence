class Api::FriendsController < ApplicationController
    skip_before_action :verify_authenticity_token
    # protect_from_forgery with: :null_session
    def add_friend
        current_user.friend_request(User.find(params[:user_id]))
    end
end
