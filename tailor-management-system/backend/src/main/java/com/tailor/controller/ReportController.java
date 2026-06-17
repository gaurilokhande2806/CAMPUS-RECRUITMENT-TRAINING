package com.tailor.controller;

import com.tailor.model.InventoryLog;
import com.tailor.model.Invoice;
import com.tailor.model.Order;
import com.tailor.repository.InventoryLogRepository;
import com.tailor.repository.InvoiceRepository;
import com.tailor.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> reports = new HashMap<>();

        // 1. Monthly Revenue Trend (aggregate invoices)
        // For simplicity in seed data, we will map standard monthly labels with actual sums
        List<Invoice> invoices = invoiceRepository.findAll();
        Map<String, Double> monthlyRevenue = new LinkedHashMap<>();
        monthlyRevenue.put("Jan", 45000.0);
        monthlyRevenue.put("Feb", 52000.0);
        monthlyRevenue.put("Mar", 48000.0);
        monthlyRevenue.put("Apr", 65000.0);
        monthlyRevenue.put("May", 70000.0);
        monthlyRevenue.put("Jun", 0.0); // Will add current month's paid invoices

        double junPaidSum = invoices.stream()
                .filter(inv -> "PAID".equals(inv.getPaymentStatus()))
                .mapToDouble(Invoice::getGrandTotal)
                .sum();
        monthlyRevenue.put("Jun", monthlyRevenue.get("Jun") + junPaidSum);

        reports.put("revenueTrend", monthlyRevenue);

        // 2. Orders by Dress Category (aggregate orders)
        List<Order> orders = orderRepository.findAll();
        Map<String, Long> categoryDistribution = new HashMap<>();
        for (Order o : orders) {
            String category = "Other";
            String dress = o.getDressType().toLowerCase();
            if (dress.contains("suit")) {
                category = "Suits";
            } else if (dress.contains("lehenga")) {
                category = "Lehengas";
            } else if (dress.contains("sherwani")) {
                category = "Sherwanis";
            } else if (dress.contains("shirt")) {
                category = "Shirts";
            } else if (dress.contains("blazer")) {
                category = "Blazers";
            } else if (dress.contains("bandhgala")) {
                category = "Bandhgalas";
            }
            categoryDistribution.put(category, categoryDistribution.getOrDefault(category, 0L) + 1);
        }
        reports.put("categoryDistribution", categoryDistribution);

        // 3. Order Status Distribution (aggregate orders)
        Map<String, Long> statusDistribution = orders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));
        
        // Ensure all Kanban columns are represented even if empty
        String[] statuses = {"PENDING", "CUTTING", "STITCHING", "READY", "DELIVERED"};
        for (String s : statuses) {
            if (!statusDistribution.containsKey(s)) {
                statusDistribution.put(s, 0L);
            }
        }
        reports.put("statusDistribution", statusDistribution);

        // 4. Inventory Consumption (aggregate logs)
        // Look at negative logs (consumption)
        // Group by fabric name
        List<InventoryLog> logs = inventoryLogRepository.findAll();
        Map<String, Double> fabricConsumption = new HashMap<>();
        
        // Seed some historical values for the graph
        fabricConsumption.put("Navy Blue Wool", 18.5);
        fabricConsumption.put("Crimson Red Silk", 12.0);
        fabricConsumption.put("Sandy Beige Linen", 8.0);
        fabricConsumption.put("White Giza Cotton", 22.0);
        fabricConsumption.put("Italian Velvet", 5.5);

        for (InventoryLog log : logs) {
            if ("CONSUMPTION".equals(log.getLogType())) {
                String fabric = log.getInventoryItem().getFabricName();
                // Extract short name
                if (fabric.contains("(")) {
                    fabric = fabric.substring(0, fabric.indexOf("(")).trim();
                }
                double change = Math.abs(log.getChangeQty());
                fabricConsumption.put(fabric, fabricConsumption.getOrDefault(fabric, 0.0) + change);
            }
        }
        reports.put("inventoryConsumption", fabricConsumption);

        return ResponseEntity.ok(reports);
    }
}
