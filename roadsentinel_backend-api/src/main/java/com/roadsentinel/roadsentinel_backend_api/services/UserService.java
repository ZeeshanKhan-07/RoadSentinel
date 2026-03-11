package com.roadsentinel.roadsentinel_backend_api.services;

import com.roadsentinel.roadsentinel_backend_api.dtos.UserDTO;

public interface UserService { //using interface to decouple the service layer from the implementation, allowing for easier testing and maintenance

    UserDTO createUser(UserDTO userDTO); //method to create a new user, taking a UserDTO as input and returning the created UserDTO

    UserDTO getUserByEmail(String email);

    UserDTO updateUser(UserDTO userDTO, String userId);

    void deleteUser(String userId);

    UserDTO getUserById(String userId);

    Iterable<UserDTO> getAllUsers();
    
}

