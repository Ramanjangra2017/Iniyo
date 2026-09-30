package com.iniyo.store.model;
import jakarta.persistence.*; import java.math.BigDecimal;
@Entity public class Product { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; @Column(nullable=false) public String name; public String category; @Column(length=2000) public String description; public BigDecimal price; public String imageUrl; public boolean active=true; public Product(){} public Product(String n,String c,String d,BigDecimal p,String i){name=n;category=c;description=d;price=p;imageUrl=i;} }
