module Api::UsersHelper
    def user_gravatar
        gravatar_id = Digest::MD5::hexdigest(current_user.email.downcase)
        gravatar_url = "http://secure.gravatar.com/avatar/#{gravatar_id}?d=identicon"
        image_tag(gravatar_url, alt: current_user.nickname, class: "gravatar")
    end
end
