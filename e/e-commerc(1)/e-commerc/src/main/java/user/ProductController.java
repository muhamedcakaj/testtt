package user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ProductController {
    private ProductService productService;

    @Autowired
    public ProductController(final ProductService productService) {
        this.productService = productService;
    }

    @GetMapping(path = "/products/id/{id}")
    public ProductEntity getById(@PathVariable(name = "id") int id) {
        return productService.findById(id);
    }

    @GetMapping(path = "/products")
    public List<ProductEntity> getAllUsers() {
        return productService.findAll();

    }
    @GetMapping(path = "/products/{category}")
    public List<ProductEntity>getProductWithCategory(@PathVariable(name="category") String category){
        return productService.findProductsWithCategory(category);
    }

    @PostMapping(path = "/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductEntity product) {
        try {
            ProductEntity createdProduct = productService.save(product);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<String> updateUserColumns(
            @PathVariable(name="id") int id,
            @RequestBody Map<String, String> columnUpdates) {

        ProductEntity user = productService.findById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }

        for (Map.Entry<String, String> entry : columnUpdates.entrySet()) {
            String columnName = entry.getKey();
            String columnValue = entry.getValue();

            // Update the specified column
            switch (columnName) {
                case "id":
                    break;
                case "product_name":
                    user.setProduct_name(columnValue);
                    break;
                case "product_description":
                    user.setProduct_description(columnValue);
                    break;
                case "price":
                    user.setPrice(Double.parseDouble(columnValue));
                    break;
                case "quantity":
                    user.setQuantity(Integer.parseInt(columnValue));
                    break;
                case "photo1_url":
                    user.setPhoto1_url(columnValue);
                break;
                case "photo2_url":
                    user.setPhoto2_url(columnValue);
                    break;
                case "photo3_url":
                    user.setPhoto3_url(columnValue);
                    break;
                case "photo4_url":
                    user.setPhoto4_url(columnValue);
                    break;
                case"prodhuesi":
                    user.setProdhuesi(columnValue);
                    break;
                case"garancioni":
                    user.setGarancioni(columnValue);
                    break;
                case"vend_iprodhimit":
                    user.setVendIProdhimit(columnValue);
                    break;
                case"category":
                    user.setCategory(columnValue);
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid column name: " + columnName);
            }
        }

        // Save the updated user
        ProductEntity updatedUser = productService.save(user);
        return ResponseEntity.ok(String.valueOf(updatedUser));
    }


    @DeleteMapping(path = "/products/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable(name = "id") int id) {
        try {
            System.out.println(id);
            productService.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }
    }
}
