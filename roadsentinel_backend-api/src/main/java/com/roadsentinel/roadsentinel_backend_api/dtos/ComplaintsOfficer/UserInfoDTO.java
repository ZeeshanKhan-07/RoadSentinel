package com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoDTO {
    private UUID id;
    private String name;
    private String email;
}