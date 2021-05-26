class Match < ApplicationRecord
    has_many :users
    belongs_to :player, class_name: "Match", foreign_key: :first_player_id
end
