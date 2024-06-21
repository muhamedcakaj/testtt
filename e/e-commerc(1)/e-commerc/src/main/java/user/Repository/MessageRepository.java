package user.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import user.Entity.MessageEntity;

public interface MessageRepository extends JpaRepository<MessageEntity,Integer> {
    
}
