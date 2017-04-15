package <%= package %>;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;<% if (plugins.security) { %>
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;<% } %><% if (plugins.restDoc) { %>
import org.springframework.restdocs.JUnitRestDocumentation;<% } %>
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;<% if (plugins.restDoc) { %>

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;<% } %><% if (!plugins.restDoc) { %>
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;<% } %>
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
		"logging.level.root=INFO", "management.context-path=/manage"
})
public class <%= nameCap %>ApplicationTest {<% if (plugins.restDoc) { %>

	@Rule
	public JUnitRestDocumentation restDocumentation = new JUnitRestDocumentation("target/generated-snippets");<% } %>

	private MockMvc mockMvc;

	@Autowired
	private WebApplicationContext context;

	@Before
	public void setUp() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
      .alwaysDo(MockMvcResultHandlers.print())<% if (plugins.security) { %>
      .apply(SecurityMockMvcConfigurers.springSecurity())<% } %><% if (plugins.restDoc) { %>
			.apply(documentationConfiguration(this.restDocumentation).uris().withScheme("http").withHost("localhost").withPort(<%= port %>))<% } %>
			.build();
	}

	@Test<% if (plugins.security) { %>
  @WithMockUser(roles = "ACTUATOR")<% } %>
	public void test() throws Exception {
		this.mockMvc.perform(get("/manage/health").accept(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())<% if (plugins.restDoc) { %>.andDo(document("health",
				preprocessRequest(prettyPrint()), preprocessResponse(prettyPrint())))<% } %>;
	}
}
