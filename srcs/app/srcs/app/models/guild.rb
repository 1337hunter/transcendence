class Guild < ApplicationRecord
  has_many :members, -> { where(guild_accepted: true) }, dependent: :nullify, class_name: "User", :foreign_key => :guild_id
  has_many :soldiers, -> { where(guild_accepted: true, guild_officer: false, guild_master: false) }, class_name: "User", :foreign_key => :guild_id
  has_one :master, -> { where(guild_master: true) }, class_name: "User", :foreign_key => :guild_id
  has_many :officers, -> { where(guild_officer: true) }, class_name: "User", :foreign_key => :guild_id
  has_many :requests, -> { where(guild_accepted: false) },  dependent: :nullify, class_name: "User", :foreign_key => :guild_id
  has_many :guild_invitations, dependent: :destroy, class_name: "GuildInvitation", :foreign_key => :guild_id
  has_many :war_invites_sent, -> { where(accepted: false) },  dependent: :nullify,  class_name: "War", foreign_key: "guild1_id"
  #has_one :active_war, -> { where(finished: false, accepted: true) }, class_name: "War", foreign_key: "guild1_id"
  #has_many :finished_wars, -> { where(finished: true) }, class_name: "War", foreign_key: "guild1_id"
  has_many :war_invites_received, -> { where(accepted: false) },  dependent: :nullify, class_name: "War", foreign_key: "guild2_id"

  include ActiveModel::Validations
  validates :name, uniqueness: { case_sensitive: false }, presence: true
  validates :anagram, uniqueness: { case_sensitive: true }, presence: true
  validates_with GuildValidator

  def wars
    War.where('guild1_id = :id OR guild2_id = :id', id: id).where(accepted:true)
  end

  def wars_finished
    War.where('guild1_id = :id OR guild2_id = :id', id: id).where(finished:true)
  end

  def has_active_war
    wars = War.where('guild1_id = :id OR guild2_id = :id', id: id).where(accepted:true).where(finished:false)
    return wars.empty?  == false
  end

end
