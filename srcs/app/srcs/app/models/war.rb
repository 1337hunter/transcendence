class War < ApplicationRecord
  belongs_to :guild1, class_name: 'Guild'
  belongs_to :guild2, class_name: 'Guild'

  include ActiveModel::Validations
  validates_with WarValidator

  def define_winner
    if g1_score == g2_score
        0
    else
        g1_matches_won > g2_matches_won ? 1 : 2
    end
  end

end
