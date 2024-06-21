package user.Security;

import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import user.Entity.UserEntity;
import user.Repository.UserRepository;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomAuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService, CustomAuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(UserEntity request) {
        UserEntity user = new UserEntity();
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setUserName(request.getUsername());
        user.setPasswordd(passwordEncoder.encode(request.getPassword()));
        user.setUser_Address(request.getUser_Address());
        user.setUser_TelephoneNumber(request.getUser_TelephoneNumber());
        user.setRole(request.getRole());
        user.setUser_email(request.getUser_email());
        user = repository.save(user);

        String token = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new AuthenticationResponse(token, refreshToken);
    }

    public AuthenticationResponse authenticate(UsernamePasswordAuthenticationToken token) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            token.getPrincipal().toString(),
                            token.getCredentials().toString()
                    )
            );

            UserEntity user = repository.findByUsernameIgnoreCase(token.getPrincipal().toString());
            if (user == null) {
                throw new UsernameNotFoundException("Username not found");
            }

            String tokenValue = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            return new AuthenticationResponse(tokenValue, refreshToken);
        } catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Username not found");
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Incorrect password");
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication failed", e);
        }
    }

    public AuthenticationResponse refreshToken(String refreshToken) {
        try {
            String username = jwtService.extractUsername(refreshToken);
            UserEntity user = repository.findByUsernameIgnoreCase(username);
            if (user == null) {
                throw new UsernameNotFoundException("User not found");
            }

            if (!jwtService.validateToken(refreshToken, user)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid refresh token");
            }

            String newToken = jwtService.generateToken(user);
            String newRefreshToken = jwtService.generateRefreshToken(user);
            return new AuthenticationResponse(newToken, newRefreshToken);
        } catch (JwtException | IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid refresh token");
        }
    }
}