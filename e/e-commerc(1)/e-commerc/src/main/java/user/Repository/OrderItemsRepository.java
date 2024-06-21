package user.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import user.Entity.OrderItemsEntity;


@Repository
public interface OrderItemsRepository extends JpaRepository<OrderItemsEntity,Integer> {
}
