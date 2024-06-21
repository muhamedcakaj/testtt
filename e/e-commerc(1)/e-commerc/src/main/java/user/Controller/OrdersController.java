package user.Controller;




import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import user.Entity.OrdersEntity;
import user.Service.OrdersService;

import java.util.List;
import java.util.Map;

@RestController
public class OrdersController {
    private OrdersService ordersService;

    public OrdersController(final OrdersService ordersService){
        this.ordersService=ordersService;
    }

    @GetMapping(path = "/orders/id/{id}")
    public OrdersEntity getById(@PathVariable(name = "id") int id) {
        return ordersService.findById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(path = "/orders")
    public List<OrdersEntity> getAllUsers() {
        return ordersService.findAll();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/orders/{userName}")
    public List <OrdersEntity> getShoppingCartsForUser(@PathVariable String userName) {
        return ordersService.getAllTheOrdersOfUser(userName);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/orders/findUserOrders/{userName}")
    public List<OrdersEntity> getUserOrders(@PathVariable String userName){
        return ordersService.getAllTheOrdersOfUser(userName);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @PostMapping(path = "/orders")
    public ResponseEntity<?> createProduct(@RequestBody OrdersEntity ordersEntity) {
        try {
            OrdersEntity createdProduct = ordersService.save(ordersEntity);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(path = "/orders/{id}")
    public ResponseEntity<?>deleteUser(@PathVariable(name="id") int id){
        try{
            ordersService.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found with ID: " + id);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/orders/{id}")
    public ResponseEntity<String> updateUserColumns(
            @PathVariable(name="id") int id,
            @RequestBody Map<String, String> columnUpdates) {

        OrdersEntity user = ordersService.findById(id);
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
                case"status":
                    user.setStatus(columnValue);
                    break;
                case"total":
                    user.setTotal(Double.parseDouble(columnValue));
                    break;
                case"country":
                    user.setCountry(columnValue);
                    break;
                case"city":
                    user.setCity(columnValue);
                    break;
                case"address":
                    user.setAddress(columnValue);
                    break;
                case"type_of_transport":
                    user.setType_of_transport(columnValue);
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid column name: " + columnName);
            }
        }

        // Save the updated user
        OrdersEntity updatedUser = ordersService.save(user);
        return ResponseEntity.ok(String.valueOf(updatedUser));
    }
}
