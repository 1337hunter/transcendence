class TournamentMatchmakingJob < ApplicationJob
  queue_as :default

  def make_matches
    @matches = [];
    i = 0
    while i < @users.length
      @matches.push({
        @users[i].as_json => @users[i + 1].as_json
      })
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
    TournamentMatchmakingJob.set(wait: 5.second).perform_later(@tournament)
  end
end
