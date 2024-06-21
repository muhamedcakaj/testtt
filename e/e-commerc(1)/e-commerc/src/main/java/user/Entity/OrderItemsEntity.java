package user.Entity;



import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name="order_items")
public class OrderItemsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name="order_id")
    @JsonBackReference
    private OrdersEntity order;


    @ManyToOne
    @JoinColumn(name="product_id")
    private ProductEntity product;

    private int quantity;

    private double price;

    private int id_of_product;

    private int id_of_order;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public OrdersEntity getOrder() {
        return order;
    }

    public void setOrder(OrdersEntity order) {
        this.order = order;
    }

    public ProductEntity getProduct() {
        return product;
    }

    public void setProduct(ProductEntity product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getId_of_product() {
        return id_of_product;
    }

    public void setId_of_product(int id_of_product) {
        this.id_of_product = id_of_product;
    }

    public int getId_of_order() {
        return id_of_order;
    }

    public void setId_of_order(int id_of_order) {
        this.id_of_order = id_of_order;
    }
}
