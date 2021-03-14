class User < ApplicationRecord
    has_secure_password

    validates :intra, presence: true
    validates :password_digest, presence: true
end