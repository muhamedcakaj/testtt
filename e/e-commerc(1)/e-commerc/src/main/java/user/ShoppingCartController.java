package user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ShoppingCartController {
    private ShoppingCartService shoppingCartService;

    public ShoppingCartController(ShoppingCartService shoppingCartService){
        this.shoppingCartService=shoppingCartService;
    }
    @GetMapping(path = "/shoppingCart/id/{id}")
    public ShoppingCartEntity getById(@PathVariable(name = "id") int id) {
        return shoppingCartService.findById(id);
    }

    @GetMapping(path = "/shoppingCart")
    public List<ShoppingCartEntity> getAllUsers() {
        return shoppingCartService.findAll();
    }

    @GetMapping("/shoppingCarts/{userName}")
    public List<ShoppingCartEntity> getShoppingCartsForUser(@PathVariable String userName) {
        return shoppingCartService.getShoppingCartsForUser(userName);
    }

    @PostMapping(path = "/shoppingCart")
    public ResponseEntity<?> createProduct(@RequestBody ShoppingCartEntity shoppingCartEntity) {
        try {
            ShoppingCartEntity createdProduct = shoppingCartService.save(shoppingCartEntity);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping(path = "/shoppingCart/{id}")
    public ResponseEntity<?>deleteShoppingCart(@PathVariable(name="id") int id){
        try{
            shoppingCartService.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ShoppingCart not found with ID: " + id);
        }
    }
    @DeleteMapping(path = "/shoppingCart/delete/{username}")
    public ResponseEntity<?>deleteShoppingCarts(@PathVariable(name="username") String username) {
        try {
            shoppingCartService.deleteByUsername(username);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ShoppingCart not found with ID: " + username);
        }
    }

    @PutMapping("/shoppingCart/{id}")
    public ResponseEntity<String> updateUserColumns(
            @PathVariable(name="id") int id,
            @RequestBody Map<String, String> columnUpdates) {

        ShoppingCartEntity user = shoppingCartService.findById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }

        for (Map.Entry<String, String> entry : columnUpdates.entrySet()) {
            String columnName = entry.getKey();
            String columnValue = entry.getValue();

            // Update the specified column
            switch (columnName) {
                case "username_of_user":
                    user.setUsername_ofUser(columnValue);
                    break;
                case "id_of_product":
                    user.setId_OfProduct(Integer.parseInt(columnValue));
                    break;
                case"quantity":
                    user.setQuantity(Integer.parseInt(columnValue));
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid column name: " + columnName);
            }
        }

        // Save the updated user
        ShoppingCartEntity updatedUser = shoppingCartService.save(user);
        return ResponseEntity.ok(String.valueOf(updatedUser));
    }

}
