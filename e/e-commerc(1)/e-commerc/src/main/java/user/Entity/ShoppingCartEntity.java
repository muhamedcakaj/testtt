package user.Entity;


import jakarta.persistence.*;





@Entity
@Table(name="shopping_cart")
public class ShoppingCartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private UserEntity user_id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity product_id;

    private String username_of_user;

    private int id_of_product;

    private int quantity;


    public int getId() {
        return id;
    }
    public UserEntity getUser_id() {
        return user_id;
    }

    public void setUser_id(UserEntity user_id) {
        this.user_id = user_id;
    }

    public ProductEntity getProduct_id() {
        return product_id;
    }

    public void setProduct_id(ProductEntity product_id) {
        this.product_id = product_id;
    }

    public String getUsername_ofUser() {
        return username_of_user;
    }

    public void setUsername_ofUser(String username_ofUser) {
        this.username_of_user = username_ofUser;
    }

    public int getId_OfProduct() {
        return id_of_product;
    }

    public void setId_OfProduct(int id_OfProduct) {
        this.id_of_product = id_OfProduct;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
