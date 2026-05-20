package com.leaveflow.auth;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, String> {
  Optional<AppUser> findByEmail(String email);
  boolean existsByEmail(String email);
  List<AppUser> findByRoleOrderByFullNameAsc(UserRole role);
}
