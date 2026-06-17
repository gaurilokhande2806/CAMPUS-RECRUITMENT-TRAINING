package com.tailor.controller;

import com.tailor.model.Customer;
import com.tailor.repository.CustomerRepository;
import com.tailor.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCustomers(@RequestParam(value = "search", required = false) String search) {
        List<Customer> customers;
        if (search != null && !search.trim().isEmpty()) {
            customers = customerRepository.searchCustomers(search);
        } else {
            customers = customerRepository.findAll();
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Customer c : customers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            map.put("phone", c.getPhone());
            map.put("email", c.getEmail());
            map.put("status", c.getStatus());
            map.put("lastVisit", c.getLastVisit());
            map.put("createdAt", c.getCreatedAt());
            map.put("ordersCount", orderRepository.countByCustomerId(c.getId()));
            response.add(map);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isPresent()) {
            Customer c = customerOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", c.getId());
            response.put("name", c.getName());
            response.put("phone", c.getPhone());
            response.put("email", c.getEmail());
            response.put("status", c.getStatus());
            response.put("lastVisit", c.getLastVisit());
            response.put("createdAt", c.getCreatedAt());
            response.put("ordersCount", orderRepository.countByCustomerId(c.getId()));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        if (customer.getStatus() == null) {
            customer.setStatus("ACTIVE");
        }
        Customer savedCustomer = customerRepository.save(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setName(customerDetails.getName());
            customer.setPhone(customerDetails.getPhone());
            customer.setEmail(customerDetails.getEmail());
            customer.setStatus(customerDetails.getStatus());
            customer.setLastVisit(customerDetails.getLastVisit());
            Customer updatedCustomer = customerRepository.save(customer);
            return ResponseEntity.ok(updatedCustomer);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
