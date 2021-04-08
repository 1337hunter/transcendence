module Api::UsersHelper
    def user_gravatar(email, nickname)
        gravatar_id = Digest::MD5::hexdigest(email.downcase)
        gravatar_url = "http://secure.gravatar.com/avatar/#{gravatar_id}?d=identicon"
        #image_tag(gravatar_url, alt: nickname)
    end
end
