class Api::UsersController < ApplicationController
  # GET /api/users.json
  def index
    @users = User.all
    respond_to do |format|
      format.json { render json: @users, only: %i[id nickname email wins loses] }
    end
  end
end
