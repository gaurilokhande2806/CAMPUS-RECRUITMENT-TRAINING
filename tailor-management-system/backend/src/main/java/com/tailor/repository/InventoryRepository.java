package com.tailor.repository;

import com.tailor.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    
    List<InventoryItem> findByStatus(String status);
    
    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.status = 'LOW_STOCK' OR i.status = 'OUT_OF_STOCK'")
    long countLowStockItems();

    @Query("SELECT SUM(i.availableQty) FROM InventoryItem i")
    Double calculateTotalFabricStock();
}
