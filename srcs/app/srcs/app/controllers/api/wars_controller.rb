class Api::WarsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :find_war, only: %i[show destroy accept]
  before_action :find_current_guild, only: %i[destroy accept create]
  before_action :find_guild, only: %i[index_war_requests index_war_invites]
  before_action :check_active_war, only: %i[create accept]
  before_action :check_guild_permissions, only: [:destroy]
  rescue_from ActiveRecord::RecordNotFound, :with => :war_not_found

  def index
    wars = War.all.where(accepted: true)
    if params[:guild_id]
      @guild = Guild.find(params[:guild_id])
      wars = @guild.wars
    end
    render json: wars
  end

  def show
    if @war.accepted || (find_current_guild && check_guild_permissions)
      render json: @war
    end
  end

  def index_war_invites
    wars = @guild.war_invites
    render json: wars
  end

  def index_war_requests
    wars = @guild.war_requests
    render json: wars
  end

  def create
    @opponent = Guild.find(params[:guild2_id])
    return if check_opponent || not_enough_points

    war = @guild_cur.war_requests.create(war_params)
    if war.save
      war.update(g1_name: @guild_cur.name, g2_name: @opponent.name)
      render json: war, status: :ok
    else
      render json: war.errors, status: :unprocessable_entity
    end
  end

  def accept
    if @guild_cur.id != params[:guild_id].to_i || @guild_cur.id != @war.guild2_id
      render json: { error: 'No permission' }, status: :forbidden
    elsif @war.accepted
      render json: { error: 'Already accepted' }, status: :forbidden
    else
      @opponent = Guild.find(@war.guild1_id)
      @war.update(accepted: true) if !check_opponent && !not_enough_points
    end
  end

  def destroy
    if @war.accepted
      render json: { error: "Accepted war request can't be cancelled" }, status: :forbidden
    else
      @war.destroy
    end
  end

  private

  def find_war
    @war = War.find(params[:id])
  end

  def war_not_found
    render json: { error: 'War not found' }, status: :not_found
  end

  def check_active_war
    render json: { error: 'You have a war in progress' }, status: :forbidden if @guild_cur.has_active_war
  end

  def check_opponent
    if !@opponent
      render json: { error: 'Opponent not found' }, status: :not_found
    elsif @opponent.id == current_user.guild_id
      render json: { error: "You can't start war with yourself" }, status: :forbidden
    elsif @opponent.has_active_war
      render json: { error: "#{@opponent.name} has a war in progress" }, status: :forbidden
    else
      false
    end
  end

  def not_enough_points
    stake = params[:stake].to_i
    if stake > @guild_cur.score
      render json: { error: "Your guild doesn't have enough points" }, status: :forbidden
    elsif stake > @opponent.score
      render json: { error: "#{@opponent.name} doesn't have enough points" }, status: :forbidden
    else
      false
    end
  end

  def find_current_guild
    @guild_cur = current_user.guild
    if !@guild_cur || !current_user.guild_master
      render json: { error: 'You are not a guild master' }, status: :forbidden
      return false
    end
    true
  end

  def check_guild_permissions
    if (@guild_cur.id != @war.guild1_id) && (@guild_cur.id != @war.guild2_id)
      render json: { error: 'No permission' }, status: :forbidden
      return false
    end
    true
  end

  def find_guild
    unless current_user.guild_id == params[:id].to_i && current_user.guild_master
      render json: { error: 'You are not this guild master' }, status: :forbidden
      return
    end
    @guild = Guild.find(params[:id])
  end

  def war_params
    params.permit(:guild1_id, :guild2_id,
                                :start,
                                :end,
                                :stake,
                                :wartime_start,
                                :wartime_end,
                                :wait_minutes,
                                :max_unanswered,
                                :ladder,
                                :tournament,
                                :duel)
  end

end
