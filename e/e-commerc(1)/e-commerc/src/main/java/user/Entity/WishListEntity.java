package user.Entity;

import jakarta.persistence.*;

@Entity
@Table(name="wish_list")
public class WishListEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name="product_id")
    private ProductEntity product;

    private String username_of_user;

    private int id_of_product;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public ProductEntity getProduct() {
        return product;
    }

    public void setProduct(ProductEntity product) {
        this.product = product;
    }

    public String getUsername_of_user() {
        return username_of_user;
    }

    public void setUsername_of_user(String username_of_user) {
        this.username_of_user = username_of_user;
    }

    public int getId_of_product() {
        return id_of_product;
    }

    public void setId_of_product(int id_of_product) {
        this.id_of_product = id_of_product;
    }
}
