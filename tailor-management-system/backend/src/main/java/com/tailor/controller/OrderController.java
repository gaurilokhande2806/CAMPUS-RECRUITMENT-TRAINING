package com.tailor.controller;

import com.tailor.model.Customer;
import com.tailor.model.Order;
import com.tailor.repository.CustomerRepository;
import com.tailor.repository.InventoryRepository;
import com.tailor.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        if (order.getCustomer() == null || order.getCustomer().getId() == null) {
            return ResponseEntity.badRequest().body("Customer ID is required.");
        }

        Optional<Customer> customerOpt = customerRepository.findById(order.getCustomer().getId());
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            order.setCustomer(customer);

            // Generate order number if empty
            if (order.getOrderNumber() == null || order.getOrderNumber().trim().isEmpty()) {
                String timestamp = String.valueOf(System.currentTimeMillis()).substring(9);
                order.setOrderNumber("ORD-" + timestamp);
            }

            // Update customer's last visit
            customer.setLastVisit(LocalDate.now());
            customerRepository.save(customer);

            Order saved = orderRepository.save(order);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setDressType(orderDetails.getDressType());
            order.setStatus(orderDetails.getStatus());
            order.setPriority(orderDetails.getPriority());
            order.setDeliveryDate(orderDetails.getDeliveryDate());
            order.setAssignedTailor(orderDetails.getAssignedTailor());
            order.setPaymentStatus(orderDetails.getPaymentStatus());
            order.setTotalAmount(orderDetails.getTotalAmount());
            Order updated = orderRepository.save(order);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // Direct status update for Kanban Board movement
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent() && newStatus != null) {
            Order order = orderOpt.get();
            order.setStatus(newStatus.toUpperCase());
            Order updated = orderRepository.save(order);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/todays-schedule")
    public ResponseEntity<List<Order>> getTodaysSchedule() {
        return ResponseEntity.ok(orderRepository.findTodaysSchedule(LocalDate.now()));
    }

    // Retrieve KPIs for the main dashboard cards
    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> getDashboardKPIs() {
        Map<String, Object> kpis = new HashMap<>();

        long totalCustomers = customerRepository.count();
        long activeOrders = orderRepository.countActiveOrders();
        long pendingDeliveries = orderRepository.countPendingDeliveries();
        long completedOrders = orderRepository.countCompletedOrders();
        
        Double totalRevenueVal = orderRepository.calculateTotalRevenue();
        double totalRevenue = totalRevenueVal != null ? totalRevenueVal : 0.0;
        
        long lowStockItems = inventoryRepository.countLowStockItems();

        kpis.put("totalCustomers", totalCustomers);
        kpis.put("activeOrders", activeOrders);
        kpis.put("pendingDeliveries", pendingDeliveries);
        kpis.put("completedOrders", completedOrders);
        kpis.put("revenue", totalRevenue);
        kpis.put("lowStockItems", lowStockItems);

        // Trend indicators (mocked with logical positive/negative values for display)
        kpis.put("customersTrend", "+12%");
        kpis.put("ordersTrend", "+8%");
        kpis.put("deliveriesTrend", "-2%");
        kpis.put("revenueTrend", "+24%");
        kpis.put("lowStockTrend", "+1"); // New warning item
        kpis.put("completedTrend", "+15%");

        return ResponseEntity.ok(kpis);
    }
}
