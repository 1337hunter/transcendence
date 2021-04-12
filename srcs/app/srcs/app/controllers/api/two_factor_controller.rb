class Api::TwoFactorController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :define_user

  def index
    render @user.otp_qrcode.html_safe
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
end
