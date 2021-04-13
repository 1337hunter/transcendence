class Api::TwoFactorController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :define_user

  def index
    if @user.otp_required_for_login?
      render json: {
        id: @user.id,
        otp_required_for_login: @user.otp_required_for_login,
        otp_qrcode: ''
      }
    else
      @user.update(otp_secret: User.generate_otp_secret)
      render json: {
        otp_required_for_login: @user.otp_required_for_login,
        otp_qrcode: @user.otp_qrcode.html_safe
      }
    end
  end

  def create
    if @user.validate_and_consume_otp!(params['otp'])
      @user.update(otp_required_for_login: true)
      render json: {
        id: @user.id,
        otp_required_for_login: @user.otp_required_for_login,
        otp_qrcode: @user.otp_qrcode.html_safe
      }, status: :ok
    else
      @user.errors.add :otp, 'Bad OTP'
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @user.validate_and_consume_otp!(params['otp'])
      @user.update(otp_required_for_login: false)
      render json: {base: '2FA Disabled'}, status: :ok
    else
      @user.errors.add :otp, 'Bad OTP'
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def define_user
    @user = current_user
  end
end
