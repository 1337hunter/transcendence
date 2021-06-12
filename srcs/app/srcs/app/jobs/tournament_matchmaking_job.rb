class TournamentMatchmakingJob < ApplicationJob
  queue_as :default

  def make_matches
    @matches = [];
    i = 0
    while i < @users.length
      @matches.push([
          @users[i].as_json, @users[i + 1].as_json
      ])
      user1 = User.find(@users[i].user_id)
      user2 = User.find(@users[i + 1].user_id)
      if user1.guild_accepted && user2.guild_accepted
        @war = War.find_by_guild1_id_and_guild2_id(user1.guild_id, user2.guild_id)
        @war = War.find_by_guild1_id_and_guild2_id(user2.guild_id, user1.guild_id) if !@war
      end
      Match.create(first_player_id: @users[i].user_id, second_player_id: @users[i + 1].user_id, status: 1, war_id: @war == nil ? nil : @war.id)
      i += 2
    end
    if @users.length % 2 == 1
      @users.last.update(stage: @users.last.stage + 1)
    end
    @matches.as_json
  end

  def perform(*args)
    @tournament = args.first
    @users = TournamentUser.where(stage: @tournament.stage)
    if @users.length > 1
      ActionCable.server.broadcast("tournament_#{@tournament.id}", 
      {
        matches: make_matches
      })
    else
    end
    TournamentMatchmakingJob.set(wait: 60.second).perform_later(@tournament)
  end
end
