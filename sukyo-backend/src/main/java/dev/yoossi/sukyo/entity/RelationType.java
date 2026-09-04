package dev.yoossi.sukyo.entity;

/**
 * 27수 사이의 순환 거리로 판정되는 9가지 궁합 관계.
 * distance == 0 이면 MYEONG(命), 이후 1~8 순서로 8가지 유형이 26개 거리에 걸쳐 반복된다.
 */
public enum RelationType {
    MYEONG("명", "命", "설명이 필요 없는, 완전한 이해의 관계"),
    EOP("업", "業", "애증이 뒤섞인, 뗄 수 없는 인연"),
    TAE("태", "胎", "감싸주고 품어주는 관계"),
    YEONG("영", "榮", "서로를 빛나게 하는 시너지"),
    SOE("쇠", "衰", "한쪽이 유독 기 눌리는 관계"),
    AN("안", "安", "편안하고 안정적인 궁합"),
    WI("위", "危", "자극적이지만 아슬아슬한 관계"),
    SEONG("성", "成", "함께 성장해가는 관계"),
    GOE("괴", "壞", "부딪히고 소모되는 관계");

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
        EOP, TAE, YEONG, SOE, AN, WI, SEONG, GOE
    };

    /** 두 宿 사이의 순환 거리(1~26)로 관계 유형을 판정한다. distance 0은 자기 자신(命)이다. */
    public static RelationType fromDistance(int distance) {
        if (distance == 0) return MYEONG;
        int idx = (distance - 1) % CYCLE.length;
        return CYCLE[idx];
    }
}
