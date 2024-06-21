package user.ServicesImpl;


import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import user.Entity.ProductEntity;
import user.Entity.ShoppingCartEntity;
import user.Entity.UserEntity;
import user.Repository.ProductRepository;
import user.Repository.ShoppingCartRepository;
import user.Repository.UserRepository;
import user.Service.ShoppingCartService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    private ShoppingCartRepository shoppingCartRepository;
    private UserRepository userRepository;
    private ProductRepository productRepository;

    public ShoppingCartServiceImpl(ShoppingCartRepository shoppingCartRepository,UserRepository userRepository,ProductRepository productRepository){
        this.shoppingCartRepository=shoppingCartRepository;
        this.userRepository=userRepository;
        this.productRepository=productRepository;
    }
    @Override
    public ShoppingCartEntity findById(int id) {
            Optional<ShoppingCartEntity> optionalProduct = shoppingCartRepository.findById(id);
            return optionalProduct.orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        }

    public ShoppingCartEntity save(ShoppingCartEntity shoppingCartEntity) {
        try {
            UserEntity user = this.userRepository.findByUsernameIgnoreCase(shoppingCartEntity.getUsername_ofUser());
            ProductEntity product = this.productRepository.findById(shoppingCartEntity.getId_OfProduct())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + shoppingCartEntity.getProduct_id()));

            shoppingCartEntity.setProduct_id(product);
            shoppingCartEntity.setUser_id(user);

            return shoppingCartRepository.save(shoppingCartEntity);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Error saving the new product", e);
        }
    }

    @Override
    public List<ShoppingCartEntity> findAll() {
        return this.shoppingCartRepository.findAll();
    }

    @Override
    public void deleteById(int id) {
        if (shoppingCartRepository.existsById(id)) {
            shoppingCartRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }
    public List<ShoppingCartEntity> getShoppingCartsForUser(String userName) {

        List<ShoppingCartEntity> allShoppingCarts = shoppingCartRepository.findAll();

        List<ShoppingCartEntity> userShoppingCarts = allShoppingCarts.stream()
                .filter(cart -> cart.getUser_id().getUsername().equals(userName))
                .collect(Collectors.toList());

        return userShoppingCarts;
    }

    @Override
    public void deleteByUsername(String username) {
        List<ShoppingCartEntity> allShoppingCarts = shoppingCartRepository.findAll();

        List<ShoppingCartEntity> userShoppingCarts = allShoppingCarts.stream()
                .filter(cart -> cart.getUser_id().getUsername().equals(username))
                .collect(Collectors.toList());
        for(ShoppingCartEntity shoppingCart:userShoppingCarts){
            shoppingCartRepository.deleteById(shoppingCart.getId());
        }
    }

}
