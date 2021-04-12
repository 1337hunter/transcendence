include Api::UsersHelper
require 'open-uri'

class User < ApplicationRecord
  include ActiveModel::Validations
  validates :email, uniqueness: { case_sensitive: false }, presence: true
  validates :displayname, uniqueness: { case_sensitive: false }, presence: true
  validates_with UserValidator

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :two_factor_authenticatable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:marvin]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.nickname = auth.info.nickname
      user.displayname = user.nickname
      user.avatar = URI.open(user_gravatar(auth.info.email, user.nickname)).read
      user.avatar_url = user_gravatar(auth.info.email, user.nickname)
      user.avatar_default_url = user_gravatar(auth.info.email, user.nickname)
    end
  end

  def otp_qrcode
    issuer = 'ft_transcendence'
    begin
      qrcode = RQRCode::QRCode.new(otp_provisioning_uri(email, issuer: issuer))
    rescue  # no secret key
      qrcode = RQRCode::QRCode.new('otpauth://{type}/{label}?{parameters}')
    end
    qrcode.as_svg(module_size: 4)
  end
end
