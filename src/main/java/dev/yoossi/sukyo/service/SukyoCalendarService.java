package dev.yoossi.sukyo.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.NavigableMap;
import java.util.TreeMap;

/** Japanese kyureki month/day + 月宿傍通暦; no birth-time or host-timezone dependency. */
@Service
public class SukyoCalendarService {
    public static final LocalDate MIN_DATE = LocalDate.of(1900, 1, 1);
    public static final LocalDate MAX_DATE = LocalDate.of(2100, 12, 31);
    public static final String METHOD = "kyureki-month-day-v1";

    // First-day mansion of lunar months 1..12, in the database's 角=0 order.
    // 室, 奎, 胃, 畢, 參, 鬼, 張, 角, 氐, 心, 斗, 虛
    private static final int[] MONTH_START = {11, 13, 15, 17, 19, 21, 24, 0, 2, 4, 7, 9};
    private static final NavigableMap<LocalDate, LunarMonth> MONTHS = loadMonths();

    public int getStarIndex(LocalDate date) {
        LunarDate lunar = toLunarDate(date);
        // An intercalary month uses the same numbered month's table.
        return (MONTH_START[lunar.month() - 1] + lunar.day() - 1) % 27;
    }

    public LunarDate toLunarDate(LocalDate date) {
        if (date == null || date.isBefore(MIN_DATE) || date.isAfter(MAX_DATE)) {
            throw new IllegalArgumentException("Supported dates: 1900-01-01 through 2100-12-31");
        }
        var entry = MONTHS.floorEntry(date);
        LunarMonth month = entry.getValue();
        int day = Math.toIntExact(ChronoUnit.DAYS.between(entry.getKey(), date)) + 1;
        return new LunarDate(month.year(), month.month(), day, month.leap());
    }

    private static NavigableMap<LocalDate, LunarMonth> loadMonths() {
        var months = new TreeMap<LocalDate, LunarMonth>();
        var input = SukyoCalendarService.class.getResourceAsStream("/calendar/kyureki-months.csv");
        if (input == null) throw new IllegalStateException("Missing kyureki calendar data");
        try (var reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8))) {
            for (String line; (line = reader.readLine()) != null;) {
                if (line.isBlank() || line.startsWith("#")) continue;
                String[] parts = line.split(",");
                LocalDate start = LocalDate.parse(parts[0]);
                LunarMonth month = new LunarMonth(Integer.parseInt(parts[1]),
                    Integer.parseInt(parts[2]), Boolean.parseBoolean(parts[3]));
                if (month.month() < 1 || month.month() > 12 || months.put(start, month) != null) {
                    throw new IllegalStateException("Invalid calendar month: " + line);
                }
            }
            if (months.firstKey().isAfter(MIN_DATE) || !months.lastKey().isAfter(MAX_DATE)) {
                throw new IllegalStateException("Incomplete calendar coverage");
            }
            LocalDate previous = null;
            for (LocalDate current : months.keySet()) {
                if (previous != null) {
                    long length = ChronoUnit.DAYS.between(previous, current);
                    if (length != 29 && length != 30) throw new IllegalStateException("Invalid lunar month length");
                }
                previous = current;
            }
            return Collections.unmodifiableNavigableMap(months);
        } catch (Exception e) {
            throw new IllegalStateException("Could not load kyureki calendar data", e);
        }
    }

    private record LunarMonth(int year, int month, boolean leap) {}
    public record LunarDate(int year, int month, int day, boolean leap) {}
}
