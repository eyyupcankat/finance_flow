package com.fintrack.backend.security.oauth2;

import com.fintrack.backend.entity.AuthProvider;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.repository.UserRepository;
import com.fintrack.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo userInfo = resolveUserInfo(registrationId, oAuth2User.getAttributes());

        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());
        User user = userRepository.findByProviderAndProviderId(provider, userInfo.getId())
                .orElseGet(() -> registerNewUser(provider, userInfo));

        if (!user.getName().equals(userInfo.getName())) {
            user.setName(userInfo.getName() != null ? userInfo.getName() : user.getName());
            userRepository.save(user);
        }

        UserPrincipal principal = UserPrincipal.from(user);
        principal.setAttributes(oAuth2User.getAttributes());
        return principal;
    }

    private OAuth2UserInfo resolveUserInfo(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId.toLowerCase()) {
            case "google" -> new GoogleOAuth2UserInfo(attributes);
            case "github" -> new GithubOAuth2UserInfo(attributes);
            default -> throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        };
    }

    private User registerNewUser(AuthProvider provider, OAuth2UserInfo userInfo) {
        String email = userInfo.getEmail() != null
                ? userInfo.getEmail()
                : userInfo.getId() + "@" + provider.name().toLowerCase() + ".oauth";
        User user = User.builder()
                .email(email)
                .name(userInfo.getName() != null ? userInfo.getName() : "User")
                .provider(provider)
                .providerId(userInfo.getId())
                .build();
        return userRepository.save(user);
    }
}
