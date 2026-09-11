package dev.yoossi.sukyo.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import java.time.LocalDate;
import java.util.TimeZone;
import static org.junit.jupiter.api.Assertions.*;

class SukyoCalendarServiceTest {
    private final SukyoCalendarService calendar = new SukyoCalendarService();

    // Independently checked via kosei-do.co.jp/fortune/uranai.php on 2026-09-11.
    @ParameterizedTest
    @CsvSource({
        "2002-02-25,24", "2002-02-24,23", "2002-02-26,25", "1996-03-14,8",
        "2023-03-22,13", "2023-04-06,1", "2023-04-19,14", "2023-04-20,15",
        "2024-02-09,11", "2024-02-10,11", "2024-02-29,3", "1985-01-01,17"
    })
    void agreesWithIndependentReference(String solar, int starIndex) {
        assertEquals(starIndex, calendar.getStarIndex(LocalDate.parse(solar)));
    }

    @Test
    void leapMonthIsPreservedAndUsesItsNumberedMonth() {
        assertEquals(new SukyoCalendarService.LunarDate(2023, 2, 1, true),
            calendar.toLunarDate(LocalDate.of(2023, 3, 22)));
        assertEquals(new SukyoCalendarService.LunarDate(2023, 3, 1, false),
            calendar.toLunarDate(LocalDate.of(2023, 4, 20)));
    }

    @Test
    void coversEverySupportedDayAndRejectsOutsideRange() {
        for (LocalDate day = SukyoCalendarService.MIN_DATE; !day.isAfter(SukyoCalendarService.MAX_DATE); day = day.plusDays(1)) {
            var lunar = calendar.toLunarDate(day);
            assertTrue(lunar.day() >= 1 && lunar.day() <= 30, day.toString());
            assertTrue(lunar.month() >= 1 && lunar.month() <= 12, day.toString());
            int star = calendar.getStarIndex(day);
            assertTrue(star >= 0 && star < 27, day.toString());
        }
        assertThrows(IllegalArgumentException.class, () -> calendar.getStarIndex(LocalDate.of(1899, 12, 31)));
        assertThrows(IllegalArgumentException.class, () -> calendar.getStarIndex(LocalDate.of(2101, 1, 1)));
    }

    @Test
    void hostTimezoneDoesNotChangeBirthDate() {
        TimeZone previous = TimeZone.getDefault();
        try {
            for (String zone : new String[]{"UTC", "Asia/Seoul", "America/Los_Angeles"}) {
                TimeZone.setDefault(TimeZone.getTimeZone(zone));
                assertEquals(24, calendar.getStarIndex(LocalDate.of(2002, 2, 25)));
            }
        } finally { TimeZone.setDefault(previous); }
    }
}
