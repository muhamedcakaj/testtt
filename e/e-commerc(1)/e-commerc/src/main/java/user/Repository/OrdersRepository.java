package user.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import user.Entity.OrdersEntity;


@Repository
public interface OrdersRepository extends JpaRepository<OrdersEntity,Integer> {
}
