module ApplicationHelper
  def show_svg(path)
    File.open("app/assets/images/#{path}", 'rb') do |file|
      raw file.read
    end
  end

  def check_2fa!
    redirect_to root_path if current_user.otp_required_for_login && !current_user.otp_validated
  end
end
