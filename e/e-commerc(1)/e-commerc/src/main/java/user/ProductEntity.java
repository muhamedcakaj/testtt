package user;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name="product")
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    private String product_name;
    private String product_description;
    private double price;
    private int quantity;

    private String photo1_url;
    private String photo2_url;
    private String photo3_url;
    private String photo4_url;

    private String prodhuesi;
    private String garancioni;
    private String vendIProdhimit;
    private String category;

    public int getId() {
        return id;
    }

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public String getProduct_description() {
        return product_description;
    }

    public void setProduct_description(String product_description) {
        this.product_description = product_description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getPhoto1_url() {
        return photo1_url;
    }

    public void setPhoto1_url(String photo1_url) {
        this.photo1_url = photo1_url;
    }

    public String getPhoto2_url() {
        return photo2_url;
    }

    public void setPhoto2_url(String photo2_url) {
        this.photo2_url = photo2_url;
    }

    public String getPhoto3_url() {
        return photo3_url;
    }

    public void setPhoto3_url(String photo3_url) {
        this.photo3_url = photo3_url;
    }

    public String getPhoto4_url() {
        return photo4_url;
    }

    public void setPhoto4_url(String photo4_url) {
        this.photo4_url = photo4_url;
    }

    public String getProdhuesi() {
        return prodhuesi;
    }

    public void setProdhuesi(String prodhuesi) {
        this.prodhuesi = prodhuesi;
    }

    public String getGarancioni() {
        return garancioni;
    }

    public void setGarancioni(String garancioni) {
        this.garancioni = garancioni;
    }

    public String getVendIProdhimit() {
        return vendIProdhimit;
    }

    public void setVendIProdhimit(String vendIProdhimit) {
        this.vendIProdhimit = vendIProdhimit;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
