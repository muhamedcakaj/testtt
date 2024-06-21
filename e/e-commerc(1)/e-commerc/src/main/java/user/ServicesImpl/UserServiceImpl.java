package user.ServicesImpl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import user.Entity.UserEntity;
import user.Repository.UserRepository;
import user.Service.UserService;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository){
        this.userRepository=userRepository;

    }

    @Override
    public UserEntity findById(int id) {
        Optional<UserEntity> optionalUser = userRepository.findById(id);
        return optionalUser.orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    @Override
    public UserEntity save(UserEntity userEntity) {
        try {
            return userRepository.save(userEntity);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Username already exists. Please try another one.");
        }
    }
    public UserEntity findByUsernameIgnoreCase(String username) {
        return userRepository.findByUsernameIgnoreCase(username);
    }
    public boolean checkPassword(String username, String password) {
        UserEntity user = userRepository.findByUsernameIgnoreCase(username);
        if (user != null) {
            return user.getPassword().equals(password);
        }
        return false;
    }

    @Override
    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }

    @Override
    public void deleteById(int id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsernameIgnoreCase(username);
    }
}

