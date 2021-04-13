Rails.application.routes.draw do
  root 'pong#index'

  namespace :api do
    resources :users
    resources :settings
    get '2fa', to: 'two_factor#index'
    post '2fa', to: 'two_factor#create'
    delete '2fa', to: 'two_factor#destroy'
    resources :chat
  end

  get '/pong', to: 'pong#index'

  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks',
    sessions: 'users/sessions'
  }
  devise_scope :user do
    delete 'sign_out', to: 'devise/sessions#destroy', as: :destroy_user_session_path
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '*unmatched_route', to: 'application#raise_not_found'
end
