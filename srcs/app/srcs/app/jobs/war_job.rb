class WarJob < ApplicationJob
  queue_as :default

  def perform(*war)
    # Do something later
    @war = war.first
    @war.update(finished: true, winner: @war.define_winner)
  end
end