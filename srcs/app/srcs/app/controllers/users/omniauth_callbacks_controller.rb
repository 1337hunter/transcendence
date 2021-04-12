class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def marvin
    @user = User.from_omniauth(request.env['omniauth.auth'])

    if @user.persisted?
      if @user.banned?
        flash[:danger] = 'You are banned.'
        return redirect_to root_path
      end
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: '42') if is_navigational_format?
      set_flash_message(:info, :admin) if is_navigational_format? && @user.admin
    else
      session['devise.marvin_data'] = request.env['omniauth.auth']
      redirect_to root_path
    end
  end
end
