package dev.yoossi.sukyo.config;

import dev.yoossi.sukyo.entity.Star;
import dev.yoossi.sukyo.repository.StarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class StarDataLoader implements CommandLineRunner {

    private final StarRepository starRepository;

    private record Row(String kr, String hanja, String elem, String animal, String group, String keyword) {}

    private static final List<Row> ROWS = List.of(
        new Row("각수", "角宿", "목", "교룡", "동방청룡", "개척과 추진력"),
        new Row("항수", "亢宿", "금", "용", "동방청룡", "자존심과 완벽주의"),
        new Row("저수", "氐宿", "토", "담비", "동방청룡", "은근한 끈기"),
        new Row("방수", "房宿", "일", "토끼", "동방청룡", "온화함과 관계지향"),
        new Row("심수", "心宿", "월", "여우", "동방청룡", "예민한 직감"),
        new Row("미수", "尾宿", "화", "호랑이", "동방청룡", "야망과 승부욕"),
        new Row("기수", "箕宿", "수", "표범", "동방청룡", "자유로움"),
        new Row("여수", "女宿", "토", "박쥐", "북방현무", "섬세한 손재주"),
        new Row("허수", "虛宿", "일", "쥐", "북방현무", "실속과 계산"),
        new Row("위수", "危宿", "월", "제비", "북방현무", "변화 민감성"),
        new Row("실수", "室宿", "화", "돼지", "북방현무", "포용력과 낙천"),
        new Row("벽수", "壁宿", "수", "산예", "북방현무", "학구열과 몰입"),
        new Row("규수", "奎宿", "목", "이리", "서방백호", "독립심"),
        new Row("루수", "婁宿", "금", "개", "서방백호", "충성심과 조직력"),
        new Row("위수(胃)", "胃宿", "토", "꿩", "서방백호", "실용주의"),
        new Row("묘수", "昴宿", "일", "닭", "서방백호", "부지런함"),
        new Row("필수", "畢宿", "월", "까마귀", "서방백호", "관찰력과 통찰"),
        new Row("자수", "觜宿", "화", "원숭이", "서방백호", "재치와 임기응변"),
        new Row("삼수", "參宿", "수", "원숭이", "서방백호", "다재다능"),
        new Row("정수", "井宿", "목", "승냥이", "남방주작", "논리와 원칙"),
        new Row("귀수", "鬼宿", "금", "양", "남방주작", "온순함과 배려"),
        new Row("유수", "柳宿", "토", "노루", "남방주작", "조심성"),
        new Row("성수", "星宿", "일", "말", "남방주작", "활력과 사교성"),
        new Row("장수", "張宿", "월", "사슴", "남방주작", "우아함과 예술감각"),
        new Row("익수", "翼宿", "화", "뱀", "남방주작", "매력적 카리스마"),
        new Row("진수", "軫宿", "수", "지렁이", "남방주작", "유연함과 뒷심")
    );

    @Override
    public void run(String... args) {
        if (starRepository.count() > 0) return;

        for (int i = 0; i < ROWS.size(); i++) {
            Row r = ROWS.get(i);
            Star star = new Star();
            star.setSequence(i);
            star.setKoreanName(r.kr());
            star.setHanja(r.hanja());
            star.setElement(r.elem());
            star.setAnimal(r.animal());
            star.setDirectionGroup(r.group());
            star.setKeyword(r.keyword());

            if (i == 0) { // 각수 - 풀 카피 확보분
                star.setCatchPhrase("당신은 무리 앞에 서 있지만, 사실 아무도 안 따라와도 상관없는 사람");
                star.setTemperament("겉으로는 리더처럼 보이지만 사실 \"이끄는 것\"에 관심 없다. 그냥 남들보다 먼저 움직일 뿐. 뒤따라오는 사람이 있으면 좋고, 없어도 개의치 않는다. 이 무심함이 오히려 사람을 끌어당긴다.");
                star.setLove("직진형이지만 로맨틱하지 않다. \"좋아하면 좋아한다고 말한다\"가 연애관의 전부. 밀당을 못하는 게 아니라 안 한다.");
                star.setWork("새로운 판을 여는 데는 최고, 마무리는 남에게 미룬다. 동업은 최악의 궁합이다.");
                star.setMoney("돈은 \"벌리는 대로\" 쓰는 편. 위기의 순간엔 이상하게 큰 돈이 굴러들어온다.");
                star.setDuality("낮의 추진력은 텅 빈 새벽을 피하려는 몸부림에 가깝다. 밤에 혼자 있는 시간을 못 견딘다.");
                star.setPower("角宿의 진짜 힘은 \"멈추지 않는다\"가 아니라 \"멈춰도 두렵지 않다\"는 데 있다.");
            }
            // 나머지 26개는 temperament 이하가 null -> StarResponse.profileReady=false로 프론트에서 placeholder 처리

            starRepository.save(star);
        }
    }
}
