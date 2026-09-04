package dev.yoossi.sukyo.dto;

import dev.yoossi.sukyo.entity.Star;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StarResponse {
    private String koreanName;
    private String hanja;
    private String element;
    private String animal;
    private String directionGroup;
    private String keyword;
    private boolean profileReady; // 01~07 카피가 준비된 수인지
    private String catchPhrase;
    private String temperament;
    private String love;
    private String work;
    private String money;
    private String duality;
    private String power;

    public static StarResponse from(Star star) {
        boolean ready = star.getTemperament() != null;
        return StarResponse.builder()
            .koreanName(star.getKoreanName())
            .hanja(star.getHanja())
            .element(star.getElement())
            .animal(star.getAnimal())
            .directionGroup(star.getDirectionGroup())
            .keyword(star.getKeyword())
            .profileReady(ready)
            .catchPhrase(star.getCatchPhrase())
            .temperament(star.getTemperament())
            .love(star.getLove())
            .work(star.getWork())
            .money(star.getMoney())
            .duality(star.getDuality())
            .power(star.getPower())
            .build();
    }
}
