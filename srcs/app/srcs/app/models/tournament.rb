class Tournament < ApplicationRecord
  include ActiveModel::Validations
  validates_with TournamentValidator
  has_many :users
  belongs_to :winner, class_name: "User", optional: true
end
