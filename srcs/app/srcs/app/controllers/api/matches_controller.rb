class Api::MatchesController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def index
    @matches = Match.where("first_player_id = ? OR second_player_id = ?", params[:user_id], params[:user_id])
    render json: @matches, status: :ok
  end

  def show
    @match = Match.find(params[:id])
    render json: @match, status: :ok
  end

  def update
    @match = Match.find(params[:id])
    if (params.has_key?(:winner) and params.has_key?(:first_player_score) and params.has_key?(:second_player_score))
      @player_winner = User.find(params[:winner])
      @player_loser = params[:winner] == params[:second_player_id] ? User.find(params[:ç]) : User.find(params[:second_player_id])
      @player_loser.update(loses: @player_loser.loses + 1)
      @player_winner.update(wins: @player_winner.wins + 1)
      @player_winner.update(elo: @player_winner.elo + 25)
      if @player_loser.elo < 25
        @player_loser.update(elo: 0)
      else
        @player_loser.update(elo: @player_loser.elo - 25)
      end
    end
    @match.update(status: params[:status]) if (params.has_key?(:status))
    if (params.has_key?(:winner))
      @match.update(winner: params[:winner])
      if @match.war_id
        war = War.find(@match.war_id)
          if !war.finished
            if @player_winner.guild_id == war.guild1_id
              @war.g1_score += 1
              @war.g1_matches_won += 1
              @war.save
            else
              @war.g2_score += 1
              @war.g2_matches_won += 1
              @war.save
            end
          end
      else
        @player_winner.guild.score += 1;
        @player_winner.guild.save
      end
    end
    if (params.has_key?(:first_player_score) and params.has_key?(:second_player_score))
      @match.update(first_player_score: params[:first_player_score], second_player_score: params[:second_player_score])
    end
    render json: [], status: :ok
  end

  def create
    if find_invitation(params[:user_id], params[:invited_user_id], 1) or find_invitation(params[:invited_user_id], params[:user_id], 1)
      render json: {error: 'Invitation already exists'}, status: :unprocessable_entity
    else
      user1 = User.find(params[:user_id])
      user2 = User.find(params[:invited_user_id])
      if user1.guild_accepted && user2.guild_accepted
        @war = War.find_by_guild1_id_and_guild2_id(user1.guild_id, user2.guild_id)
        @war = War.find_by_guild1_id_and_guild2_id(user2.guild_id, user1.guild_id) if !@war
      end

      @match = Match.create(player_one: User.find(params["user_id"]),
                          player_two: User.find(params["invited_user_id"]),
                          status: 1)
      if @war && check_war
        @match.update(war_id: @war.id)
        WarMatchJob.set(wait_until: DateTime.now + @war.wait_minutes.minutes).perform_later(@match)
      end
      puts 'MATCH CREATED'
      render json: @match, status: :ok
    end
  end

  def destroy
    Match.find(params[:id]).destroy
    render json: [], status: :ok
  end

    private

  def find_invitation(first_player_id, second_player_id, status)
    first_player_id = current_user.id if first_player_id == 'current'
    return Match.find_by_first_player_id_and_second_player_id_and_status(first_player_id, second_player_id, status)
  end

  def check_war
    !@war.finished && @war.accepted && @war.start >= DateTime.now() && check_wartime

      #TODO: check match type: @war.ladder / tournament / duel
  end

  def check_wartime
    return if @war.wartime_start == @war.wartime_end

    now = DateTime.now
    check_start = DateTime.new(now.year, now.month, now.day, @war.wartime_start.hour, @war.wartime_start.min, @war.wartime_start.sec, now.zone)
    check_end = DateTime.new(now.year, now.month, now.day + @war.wartime_end.day - 1, @war.wartime_end.hour, @war.wartime_end.min, @war.wartime_end.sec, now.zone)
    check_start <= now && check_end > now
  end

end
