class Api::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :define_filters
  before_action :find_user, only: %i[show update destroy]

  # GET /api/users.json
  def index
    @users = User.all
    render json: @users, only: @filters
  end

  # GET /api/users/id.json
  def show
    render json: @user, only: @filters
  end

  # PATCH/PUT /api/users/id.json
  def update
    if @user.update(user_params)
      render json: @user, only: @filters, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def find_user
    @user = if params[:id] == 'current' # /api/users/current.json
              current_user
            else
              User.find(params[:id])
            end
  end

  # DRY filters for json responses
  def define_filters
    @filters = %i[id nickname email wins loses displayname avatar_url avatar_default_url]
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(%i[displayname avatar_url])
  end

end
