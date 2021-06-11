class ResetUnunsweredMatchesCounterJob < ApplicationJob
  queue_as :default

  def perform(*args)
    @war = args.first
    @war.g1_matches_unanswered = 0
    @war.g2_matches_unanswered = 0
    if @war.end > DateTime.now.new_offset(0)
      ResetUnunsweredMatchesCounterJob.set(wait: 24.hour).perform_later(@war)
    end
  end
end
