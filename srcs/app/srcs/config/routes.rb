Rails.application.routes.draw do
  root 'pong#index'

  namespace :api do
    resources :users
  end

  get '/pong', to: 'pong#index'
  get '/settings', to: 'settings#index'

  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
