package user.Controller;




import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import user.Entity.OrderItemsEntity;
import user.Service.OrderItemsService;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
public class OrderItemsController {
    private OrderItemsService orderItemsService;


    public OrderItemsController(OrderItemsService orderItemsService){
        this.orderItemsService=orderItemsService;
    }
    @GetMapping(path = "/orderItems/id/{id}")
    public OrderItemsEntity getById(@PathVariable(name = "id") int id) {
        return orderItemsService.findById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(path = "/orderItems")
    public List<OrderItemsEntity> getAllUsers() {
        return orderItemsService.findAll();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @PostMapping(path = "/orderItems")
    public ResponseEntity<?> createProduct(@RequestBody OrderItemsEntity orderItemsEntity) {
        try {
            OrderItemsEntity createdProduct = orderItemsService.save(orderItemsEntity);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(path = "/orderItems/{id}")
    public ResponseEntity<?>deleteUser(@PathVariable(name="id") int id){
        try{
            orderItemsService.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/orderItems/{id}")
    public ResponseEntity<String> updateUserColumns(
            @PathVariable(name="id") int id,
            @RequestBody Map<String, String> columnUpdates) {

        OrderItemsEntity user = orderItemsService.findById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }

        for (Map.Entry<String, String> entry : columnUpdates.entrySet()) {
            String columnName = entry.getKey();
            String columnValue = entry.getValue();

            // Update the specified column
            switch (columnName) {
                case "id_of_order":
                    user.setId_of_order(Integer.parseInt(columnValue));
                    break;
                case "id_of_product":
                    user.setId_of_product(Integer.parseInt(columnValue));
                    break;
                case"quantity":
                    user.setQuantity(Integer.parseInt(columnValue));
                    break;
                case"price":
                    user.setPrice(Double.parseDouble(columnValue));
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid column name: " + columnName);
            }
        }

        // Save the updated user
        OrderItemsEntity updatedUser = orderItemsService.save(user);
        return ResponseEntity.ok(String.valueOf(updatedUser));
    }
}
