package user.ServicesImpl;


import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import user.Entity.ProductEntity;
import user.Entity.UserEntity;
import user.Entity.WishListEntity;
import user.Repository.ProductRepository;
import user.Repository.UserRepository;
import user.Repository.WishListRepository;
import user.Service.WishListService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class WishListServiceImpl implements WishListService {

    private WishListRepository wishListRepository;
    private UserRepository userRepository;
    private ProductRepository productRepository;

    public WishListServiceImpl(WishListRepository wishListRepository,UserRepository userRepository,ProductRepository productRepository){
        this.wishListRepository=wishListRepository;
        this.userRepository=userRepository;
        this.productRepository=productRepository;
    }



    @Override
    public WishListEntity findById(int id) {
        Optional<WishListEntity> optionalProduct = wishListRepository.findById(id);
        return optionalProduct.orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public WishListEntity save(WishListEntity wishListEntity) {
        try {
            UserEntity user = this.userRepository.findByUsernameIgnoreCase(wishListEntity.getUsername_of_user());
            ProductEntity product = this.productRepository.findById(wishListEntity.getId_of_product())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + wishListEntity.getId_of_product()));

            wishListEntity.setProduct(product);
            wishListEntity.setUser(user);

            return wishListRepository.save(wishListEntity);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Error saving the new product", e);
        }
    }

    @Override
    public List<WishListEntity> findAll() {
        return wishListRepository.findAll();
    }
    @Override
    public void deleteById(int id) {
        if (wishListRepository.existsById(id)) {
            wishListRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }
    @Override
    public List<WishListEntity> getShoppingCartsForUser(String userName) {
        List<WishListEntity> allShoppingCarts = wishListRepository.findAll();

        List<WishListEntity> userShoppingCarts = allShoppingCarts.stream()
                .filter(cart -> cart.getUser().getUsername().equals(userName))
                .collect(Collectors.toList());

        return userShoppingCarts;
    }
}
