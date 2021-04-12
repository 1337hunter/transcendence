class Api::TwoFactorController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :define_user

  private

  def define_user
    @user = current_user
  end

  def generate_qrcode
    issuer = 'ft_transcendence'
    label = "#{issuer}:#{@user.email}"
    qrcode = RQRCode::QRCode.new(@user.otp_provisioning_uri(label, issuer: issuer))
    qrcode.as_svg(module_size: 4)
  end
end
