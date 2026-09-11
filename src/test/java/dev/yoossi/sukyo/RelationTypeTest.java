package dev.yoossi.sukyo;

import dev.yoossi.sukyo.entity.RelationType;
import org.junit.jupiter.api.Test;
import java.util.EnumMap;
import static org.junit.jupiter.api.Assertions.*;

class RelationTypeTest {
    @Test
    void agreesWithKoseidoMaoExamples() {
        // https://kosei-do.co.jp/details/senseiban.html (昴 at database index 16)
        assertEquals(RelationType.EOP, RelationType.fromDistance(9)); // 昴 -> 翼
        assertEquals(RelationType.TAE, RelationType.fromDistance(18)); // 昴 -> 斗
        assertEquals(RelationType.YEONG, RelationType.fromDistance(1)); // 昴 -> 畢
        assertEquals(RelationType.CHIN, RelationType.fromDistance(26)); // 昴 -> 胃
        assertEquals(RelationType.U, RelationType.fromDistance(25)); // 昴 -> 婁
        assertEquals(RelationType.SOE, RelationType.fromDistance(2)); // 昴 -> 觜
    }

    @Test
    void all729PairsHaveReciprocalRelationsAndCorrectCounts() {
        var opposite = new EnumMap<RelationType, RelationType>(RelationType.class);
        opposite.put(RelationType.MYEONG, RelationType.MYEONG);
        opposite.put(RelationType.EOP, RelationType.TAE); opposite.put(RelationType.TAE, RelationType.EOP);
        opposite.put(RelationType.YEONG, RelationType.CHIN); opposite.put(RelationType.CHIN, RelationType.YEONG);
        opposite.put(RelationType.SOE, RelationType.U); opposite.put(RelationType.U, RelationType.SOE);
        opposite.put(RelationType.AN, RelationType.GOE); opposite.put(RelationType.GOE, RelationType.AN);
        opposite.put(RelationType.WI, RelationType.SEONG); opposite.put(RelationType.SEONG, RelationType.WI);
        for (int me = 0; me < 27; me++) {
            var counts = new EnumMap<RelationType, Integer>(RelationType.class);
            for (int partner = 0; partner < 27; partner++) {
                var forward = RelationType.fromDistance(Math.floorMod(partner - me, 27));
                var reverse = RelationType.fromDistance(Math.floorMod(me - partner, 27));
                assertEquals(opposite.get(forward), reverse);
                counts.merge(forward, 1, Integer::sum);
            }
            for (var relation : RelationType.values()) {
                int expected = relation == RelationType.MYEONG || relation == RelationType.EOP || relation == RelationType.TAE ? 1 : 3;
                assertEquals(expected, counts.get(relation));
            }
        }
        assertThrows(IllegalArgumentException.class, () -> RelationType.fromDistance(-1));
        assertThrows(IllegalArgumentException.class, () -> RelationType.fromDistance(27));
    }
}
