package cn.chat.backend.server;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;

/**
 * RestDocumentationExtension is automatically configured based on build/generated-snippets.
 */
@SpringBootTest
@ExtendWith({RestDocumentationExtension.class})
public class ServerApplicationTests {

	protected MockMvc mockMvc;

	/**
	 * The MockMvc instance is configured by using a MockMvcRestDocumentationConfigurer.* You can obtain an instance of this class from the static documentationConfiguration() method on org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.
	 *
	 * @param webApplicationContext provide configuration for a web application
	 * @param restDocumentation     provide access to the RestDocumentationContext
	 */
	@BeforeEach
	void setUp(WebApplicationContext webApplicationContext, RestDocumentationContextProvider restDocumentation) {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
				.apply(documentationConfiguration(restDocumentation))
				// 	Document the call to the service, writing the snippets into a directory named ping。
				.alwaysDo(document("{method-name}/",
						preprocessRequest(prettyPrint()),
						preprocessResponse(prettyPrint())))
				.build();
	}


}
