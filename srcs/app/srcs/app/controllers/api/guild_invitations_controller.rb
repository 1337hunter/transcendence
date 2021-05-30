class Api::GuildInvitationsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :check_officer_rights, only: [:create]
  before_action :check_user_rights, only: %i[index destroy]

  def index
    @invitations = @user.guild_invitations
    #if @invitations == nil
    #  render json: {error: 'No invitations'}, status: :not_found
    #else
      @ids = []
      @invitations.each { |invitation|
        @ids << invitation.guild_id
      }
        @guilds = Guild.all.where(id: @ids).includes(:master).joins(:master).
        select([
                 Guild.arel_table[Arel.star],
                 User.arel_table[:displayname].as("master_name"),
                 User.arel_table[:id].as("master_id")
               ])
      render json: @guilds
    #end
  end

  def show
    @guild = Guild.find(params[:id])
    render json: @guild
  end

  def create
    if find_invitation
      render json: {error: 'Invitation already exists'}, status: :unprocessable_entity
    else
      puts "Creating new guild invitation"
      @invitation = GuildInvitation.new(user_id: params[:user_id], guild_id: current_user.guild_id)
      if @invitation.save
        render json: @invitation, status: :ok
      else
        render json: @invitation.errors, status: :unprocessable_entity
      end
    end
  end

  def destroy
    if params[:guild_id] != nil
      @invitation = find_invitation
      @invitation.destroy
    else
      @invitations = @user.guild_invitations
      @invitations.each { |invitation|
        invitation.destroy
      }
    end
  end

  private

  def check_officer_rights
    if current_user.guild_officer = false &&  current_user.guild_master = false
      current_user.errors.add :base, 'No permission'
      render json: current_user.errors, status: :forbidden
    end
  end

  def check_user_rights
    @user = User.find(params[:user_id])
    if current_user != @user
      render json: {error: "No permission"}, status: :forbidden #unless current_user.admin?
    end
  end

  def find_invitation
    return GuildInvitation.find_by_user_id_and_guild_id(params[:user_id], current_user.guild_id)
  end

end