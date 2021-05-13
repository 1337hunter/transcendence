class Guild < ApplicationRecord
  has_many :members, class_name: "User", :foreign_key => :guild_id
  has_many :soldiers, -> { where(guild_officer: false, guild_master: false) }, class_name: "User", :foreign_key => :guild_id
  has_one :master, -> { where(guild_master: true) }, class_name: "User", :foreign_key => :guild_id
  has_many :officers, -> { where(guild_officer: true) }, class_name: "User", :foreign_key => :guild_id

  include ActiveModel::Validations
  validates :name, uniqueness: { case_sensitive: false }, presence: true
  validates :anagram, uniqueness: { case_sensitive: true }, presence: true
  validates_with GuildValidator
end
