package user;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductService {
    public ProductEntity findById(int id);
    public ProductEntity save(ProductEntity productEntity);
    public List<ProductEntity> findAll();

    public void deleteById(int id);

    public List<ProductEntity>findProductsWithCategory(String category);
}

