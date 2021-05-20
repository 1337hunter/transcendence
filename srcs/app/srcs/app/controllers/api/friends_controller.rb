class Api::FriendsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :define_filters
    # protect_from_forgery with: :null_session
    def index
        @users = User.where(banned: false)
        render json: @users, only: @filters
    end
    def add_friend
        @friended_user = User.find(params[:id])
        current_user.friend_request(@friended_user)
        render json: {}, status: :ok
    end

    private

    def define_filters
        @filters = %i[id nickname displayname email admin banned online last_seen_at
                      wins loses elo avatar_url avatar_default_url]
      end
end
