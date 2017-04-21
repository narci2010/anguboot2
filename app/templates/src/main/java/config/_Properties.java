package <%= package %>.config;
<% if (angular && plugins.custo) { %>
import java.io.File;<% } %>
import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import <%= package %>.exception.<%= nameCap %>ApplicativeException;

/**
 * The configuration relative to <%= name %> properties
 */
@Configuration
@ConfigurationProperties(prefix = "<%= name %>")
@Validated
public class <%= nameCap %>Properties {<% if (angular && plugins.custo) { %>

	private static final Logger LOGGER = LoggerFactory.getLogger(<%= nameCap %>Properties.class);

	private File externalResourcesDirectory;

	private int externalResourcesCacheTime = 0 ;<% } %>

	/**
	 * Configuration initialization / validation
	 */
  	@PostConstruct
	public void init() {
		// validate properties
	}<% if (angular && plugins.custo) { %>

	public File getExternalResourcesDirectory() {
		return externalResourcesDirectory;
	}

	public void setExternalResourcesDirectory(File externalResourcesDirectory) {
		this.externalResourcesDirectory = externalResourcesDirectory;
	}

	public int getExternalResourcesCacheTime() {
		return externalResourcesCacheTime;
	}

	public void setExternalResourcesCacheTime(int externalResourcesCacheTime) {
		this.externalResourcesCacheTime = externalResourcesCacheTime;
	}<% } %>
}
