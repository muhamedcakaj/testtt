package user;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    private UserRepository userRepository;

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
            return user.getPasswordd().equals(password);
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

}

