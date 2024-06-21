package user.Service;


import user.Entity.WishListEntity;

import java.util.List;

public interface WishListService {

    public WishListEntity findById(int id);

    public WishListEntity save(WishListEntity wishListEntity);

    public List<WishListEntity> findAll();

    public void deleteById(int id);

    public List<WishListEntity> getShoppingCartsForUser(String userName);
}
