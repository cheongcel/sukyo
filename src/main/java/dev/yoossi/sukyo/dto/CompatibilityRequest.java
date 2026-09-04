package dev.yoossi.sukyo.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompatibilityRequest {

    @NotNull
    @Valid
    private BirthRequest me;

    @NotNull
    @Valid
    private BirthRequest partner;
}
