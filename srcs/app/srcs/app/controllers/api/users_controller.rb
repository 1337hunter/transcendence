class Api::UsersController < ApplicationController
  # GET /api/users or /api/users.json
  def index
    @users = User.all
    respond_to do |format|
      format.json { render json: @users }
    end
  end
end
