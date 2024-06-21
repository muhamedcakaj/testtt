package user.ServicesImpl;


import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import user.Entity.OrderItemsEntity;
import user.Entity.OrdersEntity;
import user.Entity.UserEntity;
import user.Repository.OrderItemsRepository;
import user.Repository.OrdersRepository;
import user.Repository.UserRepository;
import user.Service.OrdersService;


import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class OrdersServiceImpl implements OrdersService {

    private OrdersRepository ordersRepository;
    private UserRepository userRepository;

    private OrderItemsRepository orderItemsRepository;

    public OrdersServiceImpl(OrdersRepository ordersRepository,UserRepository userRepository,OrderItemsRepository orderItemsRepository){
        this.ordersRepository=ordersRepository;
        this.userRepository=userRepository;
        this.orderItemsRepository=orderItemsRepository;
    }

    @Override
    public OrdersEntity findById(int id) {
        Optional<OrdersEntity> optionalOrder = ordersRepository.findById(id);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found with ID: " + id);
        }

        OrdersEntity order = optionalOrder.get();
        List<OrderItemsEntity> orderItems = orderItemsRepository.findAll();

        // Sort order items by order_id
        orderItems.sort(Comparator.comparingInt(OrderItemsEntity::getId_of_order));

        // Perform binary search to find the first matching order_id
        int index = binarySearch(orderItems, order.getId());
        if (index < 0) {
            return order; // No matching items found
        }

        // Collect all matching items
        while (index < orderItems.size() && orderItems.get(index).getId_of_order() == order.getId()) {
            order.addOrderItems(orderItems.get(index));
            index++;
        }

        return order;
    }

    @Override
    public OrdersEntity save(OrdersEntity ordersEntity) {
        try {
            UserEntity user = new UserEntity();
            user = userRepository.findByUsernameIgnoreCase(ordersEntity.getUsername_of_user());

            ordersEntity.setUser(user);

            OrdersEntity orders = new OrdersEntity();
            orders = this.ordersRepository.save(ordersEntity);

            return orders;
        }catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Error saving the new product", e);
        }
    }

    @Override
    public List<OrdersEntity> findAll() {
        return this.ordersRepository.findAll();
    }

    @Override
    public void deleteById(int id) {
        if (ordersRepository.existsById(id)) {
            ordersRepository.deleteById(id);
        } else {
            throw new RuntimeException("Order not found with ID: " + id);
        }
    }

    @Override
    public OrdersEntity getOrdersForUser(String userName) {

        List<OrdersEntity> allOrders = ordersRepository.findAll();

        List<OrdersEntity> userShoppingCarts = allOrders.stream()
                .filter(orders -> orders.getUser().getUsername().equals(userName))
                .collect(Collectors.toList());


        OrdersEntity orders=new OrdersEntity();
        orders=userShoppingCarts.get(userShoppingCarts.size()-1);

        return orders;
    }

    @Override
    public List<OrdersEntity>  getAllTheOrdersOfUser(String userName) {
        List<OrdersEntity> allOrders = ordersRepository.findAll();

        List<OrdersEntity> userShoppingCarts = allOrders.stream()
                .filter(orders -> orders.getUser().getUsername().equals(userName))
                .collect(Collectors.toList());


        List<OrdersEntity>allUsersOrders=userShoppingCarts;

        return allUsersOrders;
    }

    private int binarySearch(List<OrderItemsEntity> orderItems, int orderId) {
        int left = 0;
        int right = orderItems.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (orderItems.get(mid).getId_of_order() == orderId) {
                // Find the first occurrence
                while (mid > 0 && orderItems.get(mid - 1).getId_of_order() == orderId) {
                    mid--;
                }
                return mid;
            } else if (orderItems.get(mid).getId_of_order() < orderId) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return -1; // Not found
    }
}
