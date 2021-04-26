class Api::AdminController < ApplicationController
  include ApplicationHelper
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_2fa
  before_action :check_admin
  before_action :define_filters
  before_action :find_user, only: %i[user_update]
  before_action :find_chat, only: %i[chat_update]

  # GET /api/admin/users.json
  def users
    userselect = params[:filter]
    if userselect.nil? || userselect.empty?
      @users = User.all
    else
      unless User.has_attribute?(userselect)
        render json: {error: "No such filter"}, status: :not_acceptable
        return
      end
      @users = User.where("#{userselect}": true)
    end
    render json: @users, only: @userfilters
  end

  # GET /api/admin/chats.json
  def chatlist
    @rooms = Room.all
    render json: @rooms, only: @roomfilters
  end

  # PATCH /api/admin/users/id.json
  def user_update
    if params.has_key?('banned')
      if params['banned'] == true && !(@user.banned?)
        if @user == current_user
          render json: {error: "You can't ban yourself"}, status: :forbidden
          return
        end
        if @user.admin
          render json: {error: "You can't ban another admin"}, status: :forbidden
          return
        end
      end
    end

    if @user.update(user_params)
      render json: @user, only: @userfilters, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH /api/admin/users/id.json
  def chat_update
    if @room.update(room_params)
      render json: @room, only: @roomfilters, status: :ok
    else
      render json: @room.errors, status: :unprocessable_entity
    end
  end

  private

  def check_admin
    render json: {error: "You have no permission"}, status: :forbidden unless current_user.admin?
  end

  def define_filters
    @userfilters = %i[id nickname displayname email admin banned avatar_url avatar_default_url]
    @roomfilters = %i[id name owner_name private]
  end

  def find_user
    @user = User.find(params[:id])
  end

  def find_chat
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:admin).permit(%i[displayname avatar_url admin banned])
    end

  def room_params
    params.require(:admin).permit(%i[name privates])
  end
end
