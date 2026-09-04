package dev.yoossi.sukyo.dto;

import dev.yoossi.sukyo.entity.RelationType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CompatibilityResponse {
    private String myStarName;
    private String partnerStarName;
    private String relationName;   // 명/업/태/영/쇠/안/위/성/괴
    private String relationHanja;
    private String oneLiner;       // 01 관계 한줄평 - 항상 무료 공개
    private boolean unlocked;      // 결제 여부
    private String start;          // 02~05 - unlocked=false면 null
    private String romance;
    private String conflict;
    private String legacy;

    public static CompatibilityResponse locked(String myStar, String partnerStar, RelationType r) {
        return CompatibilityResponse.builder()
            .myStarName(myStar)
            .partnerStarName(partnerStar)
            .relationName(r.getKoreanName())
            .relationHanja(r.getHanja())
            .oneLiner(r.getOneLiner())
            .unlocked(false)
            .build();
    }
}
