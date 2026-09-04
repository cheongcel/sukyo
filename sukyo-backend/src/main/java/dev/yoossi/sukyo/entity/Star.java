package dev.yoossi.sukyo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 27수(二十七宿) 중 하나. sequence는 0~26이며, 달의 황경 구간(360/27도씩)에 대응한다.
 * DIVY 프로젝트처럼 JPA 엔티티로 모델링해 관계형 데이터로 관리한다.
 */
@Entity
@Table(name = "stars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Star {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer sequence; // 0~26, 황경 구간 인덱스

    @Column(nullable = false)
    private String koreanName;

    @Column(nullable = false)
    private String hanja;

    private String element;   // 오행 (목/화/토/금/수/일/월)
    private String animal;    // 상징 동물
    private String directionGroup; // 동방청룡 / 북방현무 / 서방백호 / 남방주작
    private String keyword;   // 한 줄 요약 키워드

    // 01~07 상세 카피. 아직 작성되지 않은 수는 null로 두고 프론트에서 placeholder 처리.
    @Column(columnDefinition = "TEXT")
    private String catchPhrase;
    @Column(columnDefinition = "TEXT")
    private String temperament;
    @Column(columnDefinition = "TEXT")
    private String love;
    @Column(columnDefinition = "TEXT")
    private String work;
    @Column(columnDefinition = "TEXT")
    private String money;
    @Column(columnDefinition = "TEXT")
    private String duality;
    @Column(columnDefinition = "TEXT")
    private String power;
}
