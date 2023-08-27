package com.example.projektni_sni.models.entities;

import com.example.projektni_sni.models.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "user")
public class UserEntity {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "first_name")
    private String firstName;

    @Basic
    @Column(name = "last_name")
    private String lastName;

    @Basic
    @Column(name = "username")
    private String username;

    @Basic
    @Column(name = "password")
    private String password;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "role")
    private Role role;

    @Basic
    @Column(name="certificate")
    private byte[] certificate;

    @Basic
    @Column(name="private_key")
    private byte[] privateKey;
}
