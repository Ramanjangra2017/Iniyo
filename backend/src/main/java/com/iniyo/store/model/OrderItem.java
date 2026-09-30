package com.iniyo.store.model;
import jakarta.persistence.*; import java.math.BigDecimal;
@Entity public class OrderItem { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; public Long productId; public String productName; public BigDecimal price; public int quantity; public OrderItem(){} public OrderItem(Product p,int q){productId=p.id;productName=p.name;price=p.price;quantity=q;} }
