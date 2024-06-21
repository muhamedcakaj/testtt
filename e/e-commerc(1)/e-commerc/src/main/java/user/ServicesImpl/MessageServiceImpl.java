package user.ServicesImpl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import user.Entity.MessageEntity;
import user.Entity.UserEntity;
import user.Repository.MessageRepository;
import user.Repository.UserRepository;
import user.Service.MessageService;


import java.util.List;
import java.util.Optional;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public MessageServiceImpl(MessageRepository messageRepository,UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository=userRepository;
    }

    public MessageEntity findById(int id) {
        Optional<MessageEntity> optionalProduct = messageRepository.findById(id);
        return optionalProduct.orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    @Override
    public MessageEntity save(MessageEntity messageEntity) {
        try {
            UserServiceImpl userService=new UserServiceImpl(userRepository);
            UserEntity user=new UserEntity();
            user=userService.findByUsernameIgnoreCase(messageEntity.getUsername_user());
            messageEntity.setUser(user);
            MessageEntity savedProduct = messageRepository.save(messageEntity);
            return savedProduct;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Error saving the new product"+ e);
        }
    }

    @Override
    public List<MessageEntity> findAll() {
        return messageRepository.findAll();
    }

    @Override
    public void deleteById(int id) {
        if(messageRepository.existsById(id)){
            messageRepository.deleteById(id);
        }else{
            throw new RuntimeException("User not found with id"+id);
        }
    }
}
