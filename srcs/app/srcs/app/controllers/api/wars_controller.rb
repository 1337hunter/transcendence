class Api::WarsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :find_current_guild, only: %i[destroy accept create]
  before_action :find_war, only: %i[destroy accept]
  before_action :check_active_war, only: %i[create accept]
  before_action :check_opponent, only: %i[create accept]

  def create
      stake = params[:stake].to_i
      if  stake > @guild_cur.score
        render json: {error: "Your guild doesn't have enough points"}, status: :forbidden
      elsif stake > @opponent.score
        render json: {error: @opponent.name + " doesn't have enough points"}, status: :forbidden
      else
        war = @guild_cur.war_invites_sent.create(war_params)
        if war.save
          render json: war, status: :ok
        else
          render json: war.errors, status: :unprocessable_entity
        end
      end
  end

  def accept
    if @guild_cur.id != @war.guild2_id
      render json: {error: "No permission"}, status: :forbidden
    elsif @war.accepted
      render json: {error: "Already accepted"}, status: :forbidden
    else
      @war.update(accepted:true)
    end
  end

  def destroy
    if @war.accepted
      render json: {error: "Accepted war request can't be cancelled"}, status: :forbidden
    elsif (@guild_cur.id != @war.guild1_id) &&  (@guild_cur.id != @war.guild2_id)
      render json: {error: "No permission"}, status: :forbidden
    else
      @war.destroy
    end
  end

private

  def find_war
    @war = War.find(params[:id])
  end

  def check_active_war
    if @guild_cur.has_active_war
      render json: {error: "You have a war in progress"}, status: :forbidden
    end
  end

  def check_opponent
    @opponent = Guild.find(params[:guild2_id])
    if !@opponent
      render json: {error: "Opponent not found"}, status: :not_found
    elsif @opponent.id == current_user.guild_id
      render json: {error: "You can't start war with yourself"}, status: :forbidden
    elsif @opponent.has_active_war
      render json: {error: @opponent.name + " has a war in progress"}, status: :forbidden
    end
  end

  def find_current_guild
    @guild_cur = current_user.guild
    if !@guild_cur || !current_user.guild_master
      render json: {error: "You are not a guild master"}, status: :forbidden
    end
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