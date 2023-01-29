package cn.chat.backend.server.apis;


import cn.chat.backend.server.ServerApplicationTests;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class PingControllerTest extends ServerApplicationTests {

    @Test
    void ping() throws Exception {
        // Invoke the path (/ping) of the service and indicate that an text/plain response is required.
        this.mockMvc.perform(get("/ping").accept(MediaType.TEXT_PLAIN))
                // Assert that the service produced the expected response.
                .andExpect(status().isOk());
    }

}
