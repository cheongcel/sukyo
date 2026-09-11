package dev.yoossi.sukyo.dto;

import dev.yoossi.sukyo.entity.Star;
import dev.yoossi.sukyo.service.SukyoCalendarService;
import java.util.Arrays;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StarResponse {
    private Integer starIndex; // Stable identity; two mansions share the Korean name 위수.
    private List<String> keywords;
    private String calculationMethod;
    private String koreanName;
    private String hanja;
    private String element;
    private String animal;
    private String directionGroup;
    private boolean profileReady; // 콘텐츠가 준비된 수인지
    private String catchPhrase;
    private String temperament;   // 개인 성향 (무료)
    private String love;          // 연애 성향 (무료)
    private String hookQuestion;  // 심층 리포트 유도 문구

    public static StarResponse from(Star star) {
        boolean ready = star.getTemperament() != null;
        return StarResponse.builder()
            .starIndex(star.getSequence())
            .keywords(star.getKeyword() == null ? List.of() : Arrays.stream(star.getKeyword().split("\\|"))
                .map(String::trim).filter(s -> !s.isEmpty()).toList())
            .calculationMethod(SukyoCalendarService.METHOD)
            .koreanName(star.getKoreanName())
            .hanja(star.getHanja())
            .element(star.getElement())
            .animal(star.getAnimal())
            .directionGroup(star.getDirectionGroup())
            .profileReady(ready)
            .catchPhrase(star.getCatchPhrase())
            .temperament(star.getTemperament())
            .love(star.getLove())
            .hookQuestion(star.getHookQuestion())
            .build();
    }
}
