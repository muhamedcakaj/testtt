package user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class MessageController {
    private MessageService messageService;

    @Autowired
    public MessageController(final MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping(path = "/message/id/{id}")
    public MessageEntity getById(@PathVariable(name = "id") int id) {
        return messageService.findById(id);
    }

    @GetMapping(path = "/message")
    public List<MessageEntity> getAllUsers() {
        return messageService.findAll();
    }

    @PostMapping(path = "/message")
    public ResponseEntity<?> createProduct(@RequestBody MessageEntity message) {
        try {
            MessageEntity createdProduct = messageService.save(message);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping(path = "/message/{id}")
    public ResponseEntity<?>deleteUser(@PathVariable(name="id") int id){
        try{
            messageService.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }
        }

    @PutMapping("/message/{id}")
    public ResponseEntity<String> updateUserColumns(
            @PathVariable(name="id") int id,
            @RequestBody Map<String, String> columnUpdates) {

        MessageEntity user = messageService.findById(id);
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
                case "content":
                    user.setContent(columnValue);
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid column name: " + columnName);
            }
        }

        // Save the updated user
        MessageEntity updatedUser = messageService.save(user);
        return ResponseEntity.ok(String.valueOf(updatedUser));
    }
    }
