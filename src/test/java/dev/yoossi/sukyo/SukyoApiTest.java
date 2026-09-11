package dev.yoossi.sukyo;

import dev.yoossi.sukyo.config.StarDataLoader;
import dev.yoossi.sukyo.repository.StarRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Map;
import java.util.stream.Collectors;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:sukyo;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;NON_KEYWORDS=SEQUENCE",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa", "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class SukyoApiTest {
    @Autowired MockMvc mvc;
    @Autowired StarRepository stars;
    @Autowired StarDataLoader loader;

    @Test
    void returnsZhangAndThreeKeywords() throws Exception {
        mvc.perform(post("/api/sukyo/star").contentType("application/json")
            .content("{\"year\":2002,\"month\":2,\"day\":25}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.starIndex").value(24))
            .andExpect(jsonPath("$.hanja").value("張宿"))
            .andExpect(jsonPath("$.keywords.length()").value(3))
            .andExpect(jsonPath("$.keywords[0]").value("표현력"))
            .andExpect(jsonPath("$.calculationMethod").value("kyureki-month-day-v1"));
    }

    @Test
    void rejectsImpossibleDatesIncludingNestedPartnerDate() throws Exception {
        for (String invalid : new String[]{
            "{\"year\":2002,\"month\":2,\"day\":29}",
            "{\"year\":2000,\"month\":4,\"day\":31}",
            "{\"year\":1899,\"month\":1,\"day\":1}",
            "{\"year\":2101,\"month\":1,\"day\":1}",
            "{\"year\":2002,\"month\":13,\"day\":1}", "{}"
        }) {
            mvc.perform(post("/api/sukyo/star").contentType("application/json").content(invalid))
                .andExpect(status().isBadRequest());
        }
        mvc.perform(post("/api/sukyo/compatibility").contentType("application/json")
            .content("{\"me\":{\"year\":2002,\"month\":2,\"day\":25},\"partner\":{\"year\":2002,\"month\":2,\"day\":30}}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void compatibilityUsesSameFixedCalendarAndRemainsLocked() throws Exception {
        mvc.perform(post("/api/sukyo/compatibility").contentType("application/json")
            .content("{\"me\":{\"year\":2002,\"month\":2,\"day\":25},\"partner\":{\"year\":2002,\"month\":2,\"day\":26}}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.myStarName").value("장수"))
            .andExpect(jsonPath("$.partnerStarName").value("익수"))
            .andExpect(jsonPath("$.relationHanja").value("榮"))
            .andExpect(jsonPath("$.unlocked").value(false));
    }

    @Test
    void seedingPreservesIdsAndProvidesAll27KeywordSets() {
        Map<Integer, Long> before = stars.findAll().stream()
            .collect(Collectors.toMap(s -> s.getSequence(), s -> s.getId()));
        loader.run();
        assertEquals(27, stars.count());
        for (var star : stars.findAll()) {
            assertEquals(before.get(star.getSequence()), star.getId());
            String[] words = star.getKeyword().split("\\|");
            assertEquals(3, words.length);
            for (String word : words) assertFalse(word.isBlank());
        }
    }
}
