package com.tailor.controller;

import com.tailor.model.Invoice;
import com.tailor.model.Order;
import com.tailor.repository.InvoiceRepository;
import com.tailor.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class BillingController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        Optional<Invoice> invoice = invoiceRepository.findById(id);
        return invoice.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Invoice> getInvoiceByOrderId(@PathVariable Long orderId) {
        Optional<Invoice> invoice = invoiceRepository.findByOrderId(orderId);
        return invoice.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Generate Invoice automatically based on an existing Order
    @PostMapping
    public ResponseEntity<?> generateInvoice(@RequestBody Map<String, Object> payload) {
        if (payload.get("orderId") == null) {
            return ResponseEntity.badRequest().body("Order ID is required.");
        }

        Long orderId = Long.parseLong(payload.get("orderId").toString());
        Double discountAmount = payload.get("discountAmount") != null ? 
                Double.parseDouble(payload.get("discountAmount").toString()) : 0.0;
        String paymentMethod = payload.get("paymentMethod") != null ? 
                payload.get("paymentMethod").toString() : "UPI";
        String paymentStatus = payload.get("paymentStatus") != null ? 
                payload.get("paymentStatus").toString() : "PAID";

        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();

            // Check if invoice already exists
            Optional<Invoice> existing = invoiceRepository.findByOrderId(orderId);
            if (existing.isPresent()) {
                return ResponseEntity.badRequest().body("Invoice already exists for this order.");
            }

            double subtotal = order.getTotalAmount();
            double taxableAmount = subtotal - discountAmount;
            
            // Calculate GST (18%)
            double gstAmount = Math.round((taxableAmount * 0.18) * 100.0) / 100.0;
            double grandTotal = Math.round((taxableAmount + gstAmount) * 100.0) / 100.0;

            Invoice invoice = new Invoice();
            invoice.setOrder(order);
            
            // Generate invoice number
            String timestamp = String.valueOf(System.currentTimeMillis()).substring(9);
            invoice.setInvoiceNumber("INV-2026-" + timestamp);
            
            invoice.setSubtotal(subtotal);
            invoice.setDiscountAmount(discountAmount);
            invoice.setGstAmount(gstAmount);
            invoice.setGrandTotal(grandTotal);
            invoice.setPaymentStatus(paymentStatus);
            invoice.setPaymentMethod("PAID".equals(paymentStatus) ? paymentMethod : null);

            // Generate UPI payment QR payload
            String upiUrl = "upi://pay?pa=tailorcorp@okaxis&pn=TailorManagementSystem&am=" + grandTotal + "&cu=INR";
            invoice.setQrPayload(upiUrl);

            Invoice saved = invoiceRepository.save(invoice);

            // Update order payment status
            order.setPaymentStatus("PAID".equals(paymentStatus) ? "PAID" : "PENDING");
            orderRepository.save(order);

            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> markAsPaid(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String method = payload.get("paymentMethod");
        Optional<Invoice> invoiceOpt = invoiceRepository.findById(id);
        if (invoiceOpt.isPresent()) {
            Invoice invoice = invoiceOpt.get();
            invoice.setPaymentStatus("PAID");
            invoice.setPaymentMethod(method != null ? method : "UPI");
            Invoice updated = invoiceRepository.save(invoice);

            // Update associated order payment status
            Order order = invoice.getOrder();
            order.setPaymentStatus("PAID");
            orderRepository.save(order);

            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}
