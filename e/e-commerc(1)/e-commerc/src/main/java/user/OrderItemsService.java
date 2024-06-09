package user;

import java.util.List;

public interface OrderItemsService {


    public OrderItemsEntity findById(int id);

    public OrderItemsEntity save(OrderItemsEntity orderItemsEntity);

    public List<OrderItemsEntity> findAll();

    public void deleteById(int id);
}
