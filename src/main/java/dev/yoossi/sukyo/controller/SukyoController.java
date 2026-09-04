package dev.yoossi.sukyo.controller;

import dev.yoossi.sukyo.dto.BirthRequest;
import dev.yoossi.sukyo.dto.CompatibilityRequest;
import dev.yoossi.sukyo.dto.CompatibilityResponse;
import dev.yoossi.sukyo.dto.StarResponse;
import dev.yoossi.sukyo.service.SukyoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/sukyo")
@RequiredArgsConstructor
public class SukyoController {

    private final SukyoService sukyoService;

    @PostMapping("/star")
    public StarResponse getStar(@Valid @RequestBody BirthRequest request) {
        return sukyoService.resolveStar(request);
    }

    @PostMapping("/compatibility")
    public CompatibilityResponse getCompatibility(@Valid @RequestBody CompatibilityRequest request) {
        LocalDate me = LocalDate.of(
            request.getMe().getYear(), request.getMe().getMonth(), request.getMe().getDay());
        LocalDate partner = LocalDate.of(
            request.getPartner().getYear(), request.getPartner().getMonth(), request.getPartner().getDay());
        return sukyoService.resolveCompatibility(me, partner);
    }
}
