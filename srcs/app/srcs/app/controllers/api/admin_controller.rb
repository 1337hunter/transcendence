class Api::AdminController < ApplicationController
  include ApplicationHelper
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_2fa
  before_action :check_admin
  before_action :define_filters
  before_action :find_user, only: %i[]

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

  def admins
    @users = User.where(admin: true)
    render json: @users, only: @userfilters
  end

  # GET /api/admin/chats.json
  def chatlist
    @rooms = User.all
    render json: @rooms, only: @roomfilters
  end

  private

  def define_filters
    @userfilters = %i[id nickname displayname email admin banned avatar_url avatar_default_url]
    @roomfilters = %i[id name owner_name private]
  end

  def find_user
    @user = User.find(params[:id])
  end

  def check_admin
    render json: {error: "You have no permission"}, status: :forbidden unless current_user.admin?
  end
end
