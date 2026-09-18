package com.currencyconveterworld.currencyconveterworld.Security;

import com.currencyconveterworld.currencyconveterworld.Entities.User;
import com.currencyconveterworld.currencyconveterworld.Repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        System.out.println("=================================");
        System.out.println("GOOGLE LOGIN SUCCESS HANDLER CALLED");
        System.out.println("=================================");

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        String email =
                oauthUser.getAttribute("email");

        String name =
                oauthUser.getAttribute("name");

        String providerId =
                oauthUser.getAttribute("sub");

        System.out.println("Google Name: " + name);
        System.out.println("Google Email: " + email);
        System.out.println("Google Provider ID: " + providerId);

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        User user;

        if (optionalUser.isPresent()) {

            System.out.println("Existing user found in database.");

            user = optionalUser.get();

            if (user.getProvider() == null) {

                user.setProvider("GOOGLE");
                user.setProviderId(providerId);
            }

            user.setEnabled(true);
            user.setEmailVerified(true);

            userRepository.save(user);

        } else {

            System.out.println("New Google user. Creating account.");

            user = new User();

            user.setName(name);
            user.setEmail(email);
            user.setPassword(null);

            user.setRole("USER");

            user.setProvider("GOOGLE");
            user.setProviderId(providerId);

            user.setEmailVerified(true);
            user.setEnabled(true);

            user.setCreatedAt(LocalDateTime.now());

            userRepository.save(user);
        }

        System.out.println("Generating JWT...");

        String token =
                jwtService.generateToken(user.getEmail());

        System.out.println("JWT generated successfully.");

        System.out.println("Redirecting to React...");

        response.sendRedirect(
        "https://currency-converter-world1.vercel.app/oauth-success?token="
                + token
);

        System.out.println("Redirect completed.");
    }
}
