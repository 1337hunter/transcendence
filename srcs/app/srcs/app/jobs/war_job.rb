class WarJob < ApplicationJob
  queue_as :default

  def perform(*war)
    # Do something later
    @war = war.first
    if war.accepted
      @war.update(finished: true, winner: @war.define_winner)
    else
      @war.destroy
    end
  end

end
