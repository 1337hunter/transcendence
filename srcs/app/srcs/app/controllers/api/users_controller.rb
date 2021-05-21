class Api::UsersController < ApplicationController
  include ApplicationHelper
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_2fa!
  before_action :define_filters
  before_action :sign_out_if_banned
  before_action :find_user, only: %i[show update destroy]

  # GET /api/users.json
  def index
    @users = User.where(banned: false)
    if @user.present?
      render json: @users, only: @filters
    else
      render :json => {:error => "not-found"}.to_json, :status => 404
    end
  end

  # GET /api/users/id.json
  def show
    if @user.present?
      render json: @user.as_json(
        only: @filters,
        include: { friends: { only: @filters },
                   guild: { only: @guildfilters } }
      )
    else
      render :json => {:error => "not-found"}.to_json, :status => 404
    end
  end

  # PATCH/PUT /api/users/id.json
  def update
    if current_user.admin? || current_user == @user
      if @user.update(user_params)
        render json: @user, only: @filters, status: :ok
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    else
      @user.errors.add :base, 'You have no permission'
      render json: @user.errors, status: :forbidden
    end
  end

  def add_friend
    @friended_user = User.find(params[:id])
    current_user.friend_request(@friended_user)
    render json: {}, status: :ok
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def find_user
    @user = if params[:id] == 'current' # /api/users/current.json
              current_user
            elsif is_numeric(params[:id])
              User.find(params[:id])
            else
              User.where(displayname: params[:id])
            end
  end

  # DRY filters for json responses
  def define_filters
    @filters = %i[id nickname displayname email admin banned online last_seen_at
                  wins loses elo avatar_url avatar_default_url guild_id]
    @guildfilters = %i[name anagram]
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(%i[displayname avatar_url guild_id])
  end

  def is_numeric(str)
    r = Integer(str) rescue nil
    r == nil ? false : true
  end
end
