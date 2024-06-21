package user.ServicesImpl;



import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import user.Entity.OrderItemsEntity;
import user.Entity.OrdersEntity;
import user.Entity.ProductEntity;
import user.Repository.OrderItemsRepository;
import user.Repository.OrdersRepository;
import user.Repository.ProductRepository;
import user.Service.OrderItemsService;


import java.util.List;
import java.util.Optional;

@Service
public class OrderItemsServiceImpl implements OrderItemsService {

    private OrderItemsRepository orderItemsRepository;
    private ProductRepository productRepository;

    private OrdersRepository ordersRepository;

    public OrderItemsServiceImpl(OrderItemsRepository orderItemsRepository,ProductRepository productRepository,OrdersRepository orderRepository){
        this.orderItemsRepository=orderItemsRepository;
        this.productRepository=productRepository;
        this.ordersRepository=orderRepository;
    }

    @Override
    public OrderItemsEntity findById(int id) {
        Optional<OrderItemsEntity> optionalProduct = orderItemsRepository.findById(id);
        return optionalProduct.orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    @Override
    public OrderItemsEntity save(OrderItemsEntity orderItemsEntity) {
        try {

            ProductEntity product=new ProductEntity();
            OrdersEntity orders=new OrdersEntity();
            System.out.println(orderItemsEntity.getId_of_product());
            orders=this.ordersRepository.findById(orderItemsEntity.getId_of_order())
             .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderItemsEntity.getId_of_order()));
            product=this.productRepository.findById(orderItemsEntity.getId_of_product())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + orderItemsEntity.getId_of_product()));

            orderItemsEntity.setOrder(orders);
            orderItemsEntity.setProduct(product);

            OrderItemsEntity savedProduct = orderItemsRepository.save(orderItemsEntity);
            return savedProduct;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Error saving the new product", e);
        }
    }

    @Override
    public List<OrderItemsEntity> findAll() {
        return this.orderItemsRepository.findAll();
    }

    @Override
    public void deleteById(int id) {
        if (orderItemsRepository.existsById(id)) {
            orderItemsRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }

}
