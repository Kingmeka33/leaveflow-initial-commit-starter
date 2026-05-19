package com.leaveflow.auth;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "app_user")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppUser {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String fullName;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private UserRole role;

  private String department;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
