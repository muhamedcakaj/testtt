package user.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import user.Entity.WishListEntity;


@Repository
public interface WishListRepository extends JpaRepository<WishListEntity,Integer> {
}
