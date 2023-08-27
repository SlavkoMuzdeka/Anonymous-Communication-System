package com.example.projektni_sni.services.impl;

import com.example.projektni_sni.models.dto.JwtUser;
import com.example.projektni_sni.repositories.UserEntityRepository;
import com.example.projektni_sni.services.JwtUserDetailsService;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class JwtUserDetailsServiceImpl implements JwtUserDetailsService {

    private final UserEntityRepository userEntityRepository;
    private final ModelMapper modelMapper;


    public JwtUserDetailsServiceImpl(UserEntityRepository userEntityRepository, ModelMapper modelMapper) {
        this.userEntityRepository = userEntityRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return modelMapper.map(userEntityRepository.findByUsername(username), JwtUser.class);
    }
}
