class Api::FriendsController < ApplicationController
    skip_before_action :verify_authenticity_token
    # protect_from_forgery with: :null_session
    def add_friend
        @friended_user = User.find(params[:id])
        current_user.friend_request(@friended_user)
        render json: {}, status: :ok
    end
end
