package user;

import org.springframework.stereotype.Service;

import java.util.List;


public interface MessageService {
    public MessageEntity findById(int id);
    public MessageEntity save(MessageEntity messageEntity);
    public List<MessageEntity> findAll();

    public void deleteById(int id);
}
