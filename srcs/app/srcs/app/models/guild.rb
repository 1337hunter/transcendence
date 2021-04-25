class Guild < ApplicationRecord
  has_many :soldiers, class_name: "User", :foreign_key => :guild_id
  has_one :master, -> { where(guild_master: true) }, class_name: "User", :foreign_key => :guild_id
  has_many :officers, -> { where(guild_officer: true) }, class_name: "User", :foreign_key => :guild_id

  include ActiveModel::Validations
  validates :name, uniqueness: { case_sensitive: false }, presence: true
  validates_with GuildValidator
end
