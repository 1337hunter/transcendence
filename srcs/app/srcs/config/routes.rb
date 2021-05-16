Rails.application.routes.draw do
  root 'pong#index'

  post '2fa', to: 'api/two_factor#validate', as: 'two_factor_validate'

  namespace :api do
    get 'settings/2fa', to: 'two_factor#status'
    post 'settings/2fa', to: 'two_factor#enable'
    patch 'settings/2fa', to: 'two_factor#disable'
    resources :users
    resources :settings
    resources :rooms
    resources :messages

    get 'admin/users', to: 'admin#users'
    patch 'admin/users/:id', to: 'admin#user_update'
    get 'admin/chats', to: 'admin#chatlist'
    patch 'admin/chats/:id', to: 'admin#chat_update'

    resources :guilds do
      resources :users
    end
    get 'users_not_in_guild', to: 'guilds#users_available'
    get 'guilds/:id/members', to: 'guilds#show_members'

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
