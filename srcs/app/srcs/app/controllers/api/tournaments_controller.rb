class Api::TournamentsController < ApplicationController
  include ApplicationHelper
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_2fa!
  before_action :sign_out_if_banned
  before_action :define_filters
  before_action :find_tournament, only: %i[show update destroy]
  rescue_from ActiveRecord::RecordNotFound, :with => :tournament_not_found

  def index
    render json: Tournament.all.as_json(include: {users: {only: @filters}})
  end

  def show
    render json: @tournament
  end

  def update
  end

  def create
  end

  def delete
  end

  private

  def find_tournament
    @tournament = Tournament.find(params[:id])
  end

  def tournament_not_found
    render json: {error: 'Tournament not found'}, status: :not_found
  end

  def define_filters
    @filters = %i[displayname admin banned online last_seen_at
                  wins loses elo avatar_url avatar_default_url]
  end
end
