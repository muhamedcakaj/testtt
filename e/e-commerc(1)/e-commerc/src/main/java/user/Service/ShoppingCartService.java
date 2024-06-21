package user.Service;



import user.Entity.ShoppingCartEntity;

import java.util.List;

public interface ShoppingCartService {

    public ShoppingCartEntity findById(int id);

    public ShoppingCartEntity save(ShoppingCartEntity shoppingCartEntity);

    public List<ShoppingCartEntity> findAll();
    public void deleteById(int id);
    public List<ShoppingCartEntity> getShoppingCartsForUser(String userName);
    public void deleteByUsername(String username);
}
