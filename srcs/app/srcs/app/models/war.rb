class War < ApplicationRecord
  belongs_to :guild1, class_name: 'Guild'
  belongs_to :guild2, class_name: 'Guild'

  def define_winner
    if g1_score == g2_score
      if g1_matches_won == g2_matches_won
        #TODO: to be updated
        0
      else
        g1_matches_won > g2_matches_won ? 1 : 2
      end
    else
      g1_score > g2_score ? 1 : 2
    end
  end

end
