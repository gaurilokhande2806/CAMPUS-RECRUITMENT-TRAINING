package com.tailor.controller;

import com.tailor.model.InventoryItem;
import com.tailor.model.InventoryLog;
import com.tailor.repository.InventoryLogRepository;
import com.tailor.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllInventory() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getInventoryById(@PathVariable Long id) {
        Optional<InventoryItem> item = inventoryRepository.findById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<InventoryItem> createInventoryItem(@RequestBody InventoryItem item) {
        InventoryItem saved = inventoryRepository.save(item);
        
        // Log the initial stock creation
        InventoryLog log = new InventoryLog();
        log.setInventoryItem(saved);
        log.setChangeQty(saved.getAvailableQty());
        log.setLogType("RESTOCK");
        log.setRemarks("Initial Stock Added");
        inventoryLogRepository.save(log);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateInventoryItem(@PathVariable Long id, @RequestBody InventoryItem itemDetails) {
        Optional<InventoryItem> itemOpt = inventoryRepository.findById(id);
        if (itemOpt.isPresent()) {
            InventoryItem item = itemOpt.get();
            double oldQty = item.getAvailableQty();
            double newQty = itemDetails.getAvailableQty();

            item.setFabricName(itemDetails.getFabricName());
            item.setCategory(itemDetails.getCategory());
            item.setAvailableQty(newQty);
            item.setUnitPrice(itemDetails.getUnitPrice());
            item.setSupplier(itemDetails.getSupplier());
            item.setMinAlertQty(itemDetails.getMinAlertQty());

            InventoryItem updated = inventoryRepository.save(item);

            // Log change if quantity is updated manually
            if (oldQty != newQty) {
                InventoryLog log = new InventoryLog();
                log.setInventoryItem(updated);
                log.setChangeQty(newQty - oldQty);
                log.setLogType(newQty > oldQty ? "RESTOCK" : "CONSUMPTION");
                log.setRemarks("Manual Quantity Update");
                inventoryLogRepository.save(log);
            }

            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventoryItem(@PathVariable Long id) {
        if (inventoryRepository.existsById(id)) {
            inventoryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<InventoryLog>> getLogsByItemId(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryLogRepository.findByInventoryItemIdOrderByLoggedAtDesc(id));
    }

    // Add a log entry (restock/consume) and update the main stock automatically
    @PostMapping("/{id}/log")
    public ResponseEntity<?> addLogEntry(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<InventoryItem> itemOpt = inventoryRepository.findById(id);
        if (itemOpt.isPresent()) {
            InventoryItem item = itemOpt.get();
            Double changeQty = Double.parseDouble(payload.get("changeQty").toString());
            String logType = payload.get("logType").toString().toUpperCase(); // RESTOCK or CONSUMPTION
            String remarks = payload.get("remarks") != null ? payload.get("remarks").toString() : "";

            if ("CONSUMPTION".equals(logType)) {
                // Change qty is stored as negative or positive? In database we make it positive and adjust logic
                item.setAvailableQty(item.getAvailableQty() - Math.abs(changeQty));
            } else {
                item.setAvailableQty(item.getAvailableQty() + Math.abs(changeQty));
            }

            InventoryItem updatedItem = inventoryRepository.save(item);

            InventoryLog log = new InventoryLog();
            log.setInventoryItem(updatedItem);
            log.setChangeQty("CONSUMPTION".equals(logType) ? -Math.abs(changeQty) : Math.abs(changeQty));
            log.setLogType(logType);
            log.setRemarks(remarks);
            inventoryLogRepository.save(log);

            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getInventorySummary() {
        Map<String, Object> summary = new HashMap<>();
        
        Double totalStock = inventoryRepository.calculateTotalFabricStock();
        long lowStockCount = inventoryRepository.countLowStockItems();
        
        // Count distinct suppliers
        long distinctSuppliers = inventoryRepository.findAll().stream()
                .map(InventoryItem::getSupplier)
                .distinct()
                .count();

        summary.put("totalFabricStock", totalStock != null ? totalStock : 0.0);
        summary.put("lowStockItems", lowStockCount);
        summary.put("suppliers", distinctSuppliers);
        summary.put("monthlyUsage", 28.5); // Seeded value represent usage

        return ResponseEntity.ok(summary);
    }
}
