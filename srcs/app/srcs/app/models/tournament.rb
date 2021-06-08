class Tournament < ApplicationRecord
  include ActiveModel::Validations
  validates_with TournamentValidator
  has_many :users
end
