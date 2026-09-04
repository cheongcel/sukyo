package dev.yoossi.sukyo.service;

import dev.yoossi.sukyo.dto.BirthRequest;
import dev.yoossi.sukyo.dto.CompatibilityResponse;
import dev.yoossi.sukyo.dto.StarResponse;
import dev.yoossi.sukyo.entity.RelationType;
import dev.yoossi.sukyo.entity.Star;
import dev.yoossi.sukyo.repository.StarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SukyoService {

    private final MoonCalculatorService moonCalculatorService;
    private final StarRepository starRepository;

    public StarResponse resolveStar(BirthRequest request) {
        LocalDate date = LocalDate.of(request.getYear(), request.getMonth(), request.getDay());
        int index = moonCalculatorService.getStarIndex(date);
        Star star = starRepository.findBySequence(index)
            .orElseThrow(() -> new IllegalStateException("Star not seeded for index " + index));
        return StarResponse.from(star);
    }

    /** 결제 전: 관계 유형 + 한줄평만 반환. 실제 결제 검증은 결제 게이트웨이 웹훅과 연결해 unlocked=true로 전환한다. */
    public CompatibilityResponse resolveCompatibility(LocalDate me, LocalDate partner) {
        int myIndex = moonCalculatorService.getStarIndex(me);
        int partnerIndex = moonCalculatorService.getStarIndex(partner);
        int distance = ((partnerIndex - myIndex) % 27 + 27) % 27;

        RelationType relation = RelationType.fromDistance(distance);

        Star myStar = starRepository.findBySequence(myIndex).orElseThrow();
        Star partnerStar = starRepository.findBySequence(partnerIndex).orElseThrow();

        return CompatibilityResponse.locked(myStar.getKoreanName(), partnerStar.getKoreanName(), relation);
    }
}
