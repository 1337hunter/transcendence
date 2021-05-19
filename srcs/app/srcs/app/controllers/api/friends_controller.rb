class Api::FriendsController < ApplicationController
    # protect_from_forgery with: :null_session
    def add_friend
        current_user.friend_request(User.find(params[:user_id]))
    end
end
