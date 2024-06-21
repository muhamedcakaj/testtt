package user.Service;



import user.Entity.OrdersEntity;

import java.util.List;

public interface OrdersService {

    public OrdersEntity findById(int id);

    public OrdersEntity save(OrdersEntity ordersEntity);

    public List<OrdersEntity> findAll();

    public void deleteById(int id);

    public OrdersEntity getOrdersForUser(String userName);

    public List<OrdersEntity> getAllTheOrdersOfUser(String userName);
}
