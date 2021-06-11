class WarMatchJob < ApplicationJob
  queue_as :default

  #TODO unanswered counter
  # counter update every 24h from update_start
  # now = DateTime.now.new_offset(0)
  # if @war.wartime_start == @war.wartime_end
  #   hour = @war.start.hour
  #   min = @war.start.min
  #   sec = @war.start.sec
  # else
  #   hour = @war.wartime_start.hour
  #   min = @war.wartime_start.min
  #   sec = @war.wartime_start.sec
  # end
  # update_start = DateTime.new(now.year, now.month, now.day, hour, min, sec, now.zone)

  def perform(*args)
    @match = args.first
    if @match.status == 1 && !(war = War.find(@match.war_id)).finished
      winner_id = @match.first_player_id
      @match.update(status: 3, winner: winner_id)
      war.matches_total += 1
      winner_guild_id = User.find(winner_id).guild_id
      if winner_guild_id == war.guild1_id
        if (war.g2_matches_unanswered < war.max_unanswered)
          war.g1_score += 1
          war.g1_matches_won += 1
          war.g2_matches_unanswered += 1
        end
      else
        if (war.g1_matches_unanswered < war.max_unanswered)
          war.g2_score += 1
          war.g2_matches_won += 1
          war.g1_matches_unanswered += 1
        end
      end
      war.save
    end
  end
end
