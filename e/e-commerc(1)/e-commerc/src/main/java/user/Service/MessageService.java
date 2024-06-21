package user.Service;



import user.Entity.MessageEntity;

import java.util.List;


public interface MessageService {
    public MessageEntity findById(int id);
    public MessageEntity save(MessageEntity messageEntity);
    public List<MessageEntity> findAll();

    public void deleteById(int id);
}
