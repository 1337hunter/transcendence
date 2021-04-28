module ApplicationHelper
  def show_svg(path)
    File.open("app/assets/images/#{path}", 'rb') do |file|
      raw file.read
    end
  end

  def user_validated_2fa?
    return false unless defined?(current_user)
    current_user.otp_validated? || !current_user.otp_required_for_login?
  end

  def check_2fa
    redirect_to root_path unless user_validated_2fa?
  end

  def sign_out_if_banned
    if defined?(current_user) && current_user.banned?
      render json: {error: "You are banned"}, status: :forbidden
      sign_out(current_user)
    end
  end
end
