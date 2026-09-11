package dev.yoossi.sukyo.entity;

/** 三九の秘法: 0=命, 9=業, 18=胎; eight other relations repeat every nine steps. */
public enum RelationType {
    MYEONG("명", "命", "설명이 필요 없는, 완전한 이해의 관계"),
    EOP("업", "業", "애증이 뒤섞인, 뗄 수 없는 인연"),
    TAE("태", "胎", "감싸주고 품어주는 관계"),
    YEONG("영", "榮", "서로를 빛나게 하는 시너지"),
    SOE("쇠", "衰", "한쪽이 유독 기 눌리는 관계"),
    AN("안", "安", "서로에게 편안함을 느끼지만 역할 조율이 필요한 관계"),
    WI("위", "危", "자극적이지만 아슬아슬한 관계"),
    SEONG("성", "成", "함께 성장해가는 관계"),
    GOE("괴", "壞", "서로의 차이를 조율해야 하는 관계"),
    U("우", "友", "편안한 대화와 우정이 쌓이는 관계"),
    CHIN("친", "親", "가까이에서 애정과 신뢰를 나누는 관계");

    private final String koreanName;
    private final String hanja;
    private final String oneLiner;

    RelationType(String koreanName, String hanja, String oneLiner) {
        this.koreanName = koreanName;
        this.hanja = hanja;
        this.oneLiner = oneLiner;
    }

    public String getKoreanName() { return koreanName; }
    public String getHanja() { return hanja; }
    public String getOneLiner() { return oneLiner; }

    private static final RelationType[] CYCLE = {
        YEONG, SOE, AN, WI, SEONG, GOE, U, CHIN
    };

    /** 두 宿 사이의 순환 거리(1~26)로 관계 유형을 판정한다. distance 0은 자기 자신(命)이다. */
    public static RelationType fromDistance(int distance) {
        if (distance < 0 || distance >= 27) throw new IllegalArgumentException("Distance must be 0..26");
        if (distance == 0) return MYEONG;
        if (distance == 9) return EOP;
        if (distance == 18) return TAE;
        return CYCLE[distance % 9 - 1];
    }
}
