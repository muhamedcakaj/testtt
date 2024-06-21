package user.Entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="Orders")
public class OrdersEntity {


    public OrdersEntity(){
        this.createdAt = new Date();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name="user_id")
    private UserEntity user;

    private double total;

    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    private String username_of_user;

    private String country;
    private String city;
    private String address;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItemsEntity> orderItems = new ArrayList<>();

    private String type_of_transport;


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

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getUsername_of_user() {
        return username_of_user;
    }

    public void setUsername_of_user(String username_of_user) {
        this.username_of_user = username_of_user;
    }

    public List<OrderItemsEntity> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemsEntity> orderItems) {
        this.orderItems = orderItems;
    }

    public void addOrderItems(OrderItemsEntity orderItemsEntity){
        this.orderItems.add(orderItemsEntity);
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getType_of_transport() {
        return type_of_transport;
    }

    public void setType_of_transport(String type_of_transport) {
        this.type_of_transport = type_of_transport;
    }
}
