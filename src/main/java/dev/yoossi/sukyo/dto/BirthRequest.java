package dev.yoossi.sukyo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.AssertTrue;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.DateTimeException;
import java.time.LocalDate;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BirthRequest {

    @NotNull
    @Min(1900)
    @Max(2100)
    private Integer year;

    @NotNull
    @Min(1)
    @Max(12)
    private Integer month;

    @NotNull
    @Min(1)
    @Max(31)
    private Integer day;

    @JsonIgnore
    @AssertTrue(message = "A valid Gregorian date is required")
    public boolean isValidDate() {
        if (year == null || month == null || day == null) return true;
        try {
            LocalDate.of(year, month, day);
            return true;
        } catch (DateTimeException e) {
            return false;
        }
    }
}
