class Api::TwoFactorController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :define_user

  def index
    render generate_qrcode
  end

  def create
    @user.update(
      otp_secret: User.generate_otp_secret,
      otp_required_for_login: true
    )
  end

  def destroy
    @user.update(otp_required_for_login: false)
  end

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
