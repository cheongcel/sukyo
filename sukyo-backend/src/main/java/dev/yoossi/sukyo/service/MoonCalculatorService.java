package dev.yoossi.sukyo.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

/**
 * Jean Meeus의 달 위치 근사식(주요 20개 항) 기반 황경 계산.
 * 외부 천체력 파일 없이 각(도) 단위 정밀도로 계산하며,
 * 그 결과를 27수(360/27도씩)에 매핑하는 데 사용한다.
 */
@Service
public class MoonCalculatorService {

    private static final int STAR_COUNT = 27;
    private static final double SEGMENT_WIDTH = 360.0 / STAR_COUNT;

    public int getStarIndex(LocalDate date) {
        double longitude = moonLongitude(date);
        int index = (int) Math.floor(longitude / SEGMENT_WIDTH);
        return ((index % STAR_COUNT) + STAR_COUNT) % STAR_COUNT;
    }

    double moonLongitude(LocalDate date) {
        double jd = toJulianDay(date.getYear(), date.getMonthValue(), date.getDayOfMonth());
        double t = (jd - 2451545.0) / 36525.0;

        double l = normalize(218.3164477 + 481267.88123421 * t - 0.0015786 * t * t);
        double d = normalize(297.8501921 + 445267.1114034 * t - 0.0018819 * t * t);
        double m = normalize(357.5291092 + 35999.0502909 * t - 0.0001536 * t * t);
        double mp = normalize(134.9633964 + 477198.8675055 * t + 0.0087414 * t * t);
        double f = normalize(93.272095 + 483202.0175233 * t - 0.0036539 * t * t);

        double dR = Math.toRadians(d);
        double mR = Math.toRadians(m);
        double mpR = Math.toRadians(mp);
        double fR = Math.toRadians(f);

        double dl = 0.0;
        dl += 6.288774 * Math.sin(mpR);
        dl += 1.274027 * Math.sin(2 * dR - mpR);
        dl += 0.658314 * Math.sin(2 * dR);
        dl += 0.213618 * Math.sin(2 * mpR);
        dl -= 0.185116 * Math.sin(mR);
        dl -= 0.114332 * Math.sin(2 * fR);
        dl += 0.058793 * Math.sin(2 * dR - 2 * mpR);
        dl += 0.057066 * Math.sin(2 * dR - mR - mpR);
        dl += 0.053322 * Math.sin(2 * dR + mpR);
        dl += 0.045758 * Math.sin(2 * dR - mR);
        dl -= 0.040920 * Math.sin(mR - mpR);
        dl -= 0.034720 * Math.sin(dR);
        dl -= 0.030383 * Math.sin(mR + mpR);
        dl += 0.015327 * Math.sin(2 * dR - 2 * fR);
        dl -= 0.012528 * Math.sin(mpR + 2 * fR);
        dl += 0.010980 * Math.sin(mpR - 2 * fR);
        dl += 0.010675 * Math.sin(4 * dR - mpR);
        dl += 0.010034 * Math.sin(3 * mpR);
        dl += 0.008548 * Math.sin(4 * dR - 2 * mpR);
        dl -= 0.007888 * Math.sin(2 * dR + mR - mpR);
        dl -= 0.006766 * Math.sin(2 * dR + mR);

        return normalize(l + dl);
    }

    private double normalize(double x) {
        double r = x % 360.0;
        if (r < 0) r += 360.0;
        return r;
    }

    private double toJulianDay(int year, int month, int day) {
        int y = year;
        int m = month;
        if (m <= 2) {
            y -= 1;
            m += 12;
        }
        int a = y / 100;
        int b = 2 - a + a / 4;
        return Math.floor(365.25 * (y + 4716))
            + Math.floor(30.6001 * (m + 1))
            + day + b - 1524.5 + 12.0 / 24.0;
    }
}
