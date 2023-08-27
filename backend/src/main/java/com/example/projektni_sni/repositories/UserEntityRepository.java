package com.example.projektni_sni.repositories;

import com.example.projektni_sni.models.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEntityRepository extends JpaRepository<UserEntity, Integer> {

    UserEntity findByUsername(String username);

}
