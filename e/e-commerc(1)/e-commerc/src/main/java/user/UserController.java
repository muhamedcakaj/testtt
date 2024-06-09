package user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    private UserService userService;

    @Autowired
    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @GetMapping(path = "/user/id/{id}")
    public UserEntity getById(@PathVariable(name="id") int id){
        return userService.findById(id);
    }

    @GetMapping(path ="/user/{username}")
    public UserEntity getByUsername(@PathVariable(name="username")String username){
        return userService.findByUsernameIgnoreCase(username);
    }
    @GetMapping(path = "/users")
    public List<UserEntity> getAllUsers() {
        return userService.findAll();
    }

    @PostMapping(path = "/user")
    public ResponseEntity<?> createUser(@RequestBody UserEntity user) {
        try {
            UserEntity createdUser = userService.save(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();
        UserEntity user = userService.findByUsernameIgnoreCase(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username not found");
        }


        if (!userService.checkPassword(username, password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
        }

        if(user.getRole().equals("ADMIN")) {
            System.out.println("here");
            return ResponseEntity.ok("Login successful ADMIN");

        }
        return ResponseEntity.ok("Login successful USER");


    }
    @PutMapping("/user/{id}")
    public ResponseEntity<String> updateUserColumns(
            @PathVariable(name="id") int id,
            @RequestBody Map<String, String> columnUpdates) {

        UserEntity user = userService.findById(id);
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
                case "name":
                    user.setName(columnValue);
                    break;
                case "surname":
                    user.setSurname(columnValue);
                    break;
                case "user_name":
                    user.setUserName(columnValue);
                    break;
                case "user_email":
                    user.setUser_email(columnValue);
                    break;
                case "user_telephone_number":
                    user.setUser_TelephoneNumber(columnValue);
                    break;
                case "user_address":
                    user.setUser_Address(columnValue);
                    break;
                case "passwordd":
                    user.setPasswordd(columnValue);
                    break;
                case "role":
                    user.setRole(columnValue);
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid column name: " + columnName);
            }
        }

        // Save the updated user
        UserEntity updatedUser = userService.save(user);
        return ResponseEntity.ok(String.valueOf(updatedUser));
    }


    @DeleteMapping(path = "/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable(name = "id") int id) {
        try {
            userService.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }
    }
    }