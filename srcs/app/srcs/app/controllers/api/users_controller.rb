class Api::UsersController < ApplicationController
  before_action :authenticate_user!
  # GET /api/users.json
  def index
    @users = User.all
    respond_to do |format|
      format.json { render json: @users, only: %i[id nickname email wins loses displayname] }
    end
  end
end
