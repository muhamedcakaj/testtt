package user.Service;



import user.Entity.UserEntity;

import java.util.List;

public interface UserService {

    public UserEntity findById(int id);
    public UserEntity save(UserEntity userEntity);
    public UserEntity findByUsernameIgnoreCase(String username);
    boolean checkPassword(String username, String password);

    public List<UserEntity> findAll();

    public void deleteById(int id);
}

