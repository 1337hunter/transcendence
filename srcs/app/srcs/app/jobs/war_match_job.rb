class WarMatchJob < ApplicationJob
  queue_as :default

  #TODO counter
  def perform(*args)
    @match = args.first
    if @match.status == 1
      winner_id = @match.first_player_id
      @match.update(status: 3, winner: winner_id)
      war = War.find(@match.war_id)
      war.matches_total += 1
      winner_guild_id = User.find(winner_id).guild_id
      if winner_guild_id == war.guild1_id
        #war.update(g1_score: war.g1_score + 1, g1_matches_won: war.g1_matches_won + 1, g2_matches_unanswered: war.g2_matches_unanswered + 1)
        war.g1_score += 1
        war.g1_matches_won += 1
        war.g2_matches_unanswered += 1
      else
        #war.update(g2_score: war.g2_score + 1, g2_matches_won: war.g2_matches_won + 1,  g1_matches_unanswered: war.g1_matches_unanswered + 1)
        war.g2_score += 1
        war.g2_matches_won += 1
        war.g1_matches_unanswered += 1
      end
      war.save
    end
  end
end
