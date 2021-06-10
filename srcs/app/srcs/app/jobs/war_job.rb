class WarJob < ApplicationJob
  queue_as :default

  def perform(*war)
    # Do something later
    @war = war.first
    if war.accepted
      @war.update(finished: true, winner: @war.define_winner)
      if @war.winner
        winner_guild = Guild.find(@war.winner == 1 ? guild1_id : guild2_id)
        loser_guild = Guild.find(@war.winner == 1 ? guild2_id : guild1_id)
        winner_guild.score += war.stake
        loser_guild.score -= war.stake
        winner_guild.save
        loser_guild.save
      end
    else
      @war.destroy
    end
  end

end
