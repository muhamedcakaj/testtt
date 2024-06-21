package user.Controller;




import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import user.Entity.WishListEntity;
import user.Service.WishListService;

import java.util.List;
import java.util.Map;

@RestController
public class WishListController {

    private WishListService wishListService;
    public WishListController(WishListService wishListService){this.wishListService=wishListService;}


    @GetMapping (path="/wishList/id/{id}")
    public WishListEntity getById(@PathVariable(name="id") int id){return wishListService.findById(id);}

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping(path = "/wishList")
    public List<WishListEntity> getAllUsers() {
        return wishListService.findAll();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping("/wishList/{userName}")
    public List<WishListEntity> getShoppingCartsForUser(@PathVariable String userName) {
        return wishListService.getShoppingCartsForUser(userName);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping(path = "/wishList")
    public ResponseEntity<?> createProduct(@RequestBody WishListEntity wishListEntity) {
        try {
            WishListEntity createdProduct = wishListService.save(wishListEntity);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @DeleteMapping(path = "/wishList/{id}")
    public ResponseEntity<?>deleteUser(@PathVariable(name="id") int id){
        try{
            wishListService.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping("/wishList/{id}")
    public ResponseEntity<String> updateUserColumns(
            @PathVariable(name="id") int id,
            @RequestBody Map<String, String> columnUpdates) {

        WishListEntity user = wishListService.findById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }

        for (Map.Entry<String, String> entry : columnUpdates.entrySet()) {
            String columnName = entry.getKey();
            String columnValue = entry.getValue();

            // Update the specified column
            switch (columnName) {
                case "username_of_user":
                    user.setUsername_of_user(columnValue);
                    break;
                case "id_of_product":
                    user.setId_of_product(Integer.parseInt(columnValue));
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid column name: " + columnName);
            }
        }

        // Save the updated user
        WishListEntity updatedUser = wishListService.save(user);
        return ResponseEntity.ok(String.valueOf(updatedUser));
    }

}
