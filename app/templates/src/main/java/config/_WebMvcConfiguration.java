package <%= package %>.config;<% if (plugins.custo) { %>

import <%= package %>.config.<%= nameCap %>Properties;<%}%>

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.web.DispatcherServletAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.*;<% if (plugins.custo) { %>

import javax.annotation.PostConstruct;
import java.io.File;<%}%><% if(plugins.security) {%>

import static <%= package %>.config.FrontBasicAuthenticationEntryPoint.SECURITY_METHOD;<%}%>

/**
 * Web mvc configuration
 */
@Configuration
@AutoConfigureAfter(DispatcherServletAutoConfiguration.class)
public class WebMvcConfiguration
        extends WebMvcConfigurerAdapter {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebMvcConfiguration.class);

    @Autowired
    private Environment environment;<% if (plugins.custo) { %>

    @Autowired
    private <%= nameCap %>Properties properties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String defaultPath = "classpath:/public/";
        if(properties.getExternalResourcesDirectory() != null && properties.getExternalResourcesDirectory().exists()) {
            File[] files = properties.getExternalResourcesDirectory().listFiles(File::isDirectory);
            if (files != null) {
                for (File file : files) {
                    String resourceHandler = "/" + file.getName() + "/**";
                    String location = "file:" + new File(properties.getExternalResourcesDirectory(), file.getName()) + "/";
                    LOGGER.debug("Resources handler [{}], add location [{}]", resourceHandler, location);
                    registry.addResourceHandler(resourceHandler)
                        .addResourceLocations(location, defaultPath)
                        .setCachePeriod(properties.getExternalResourcesCacheTime());
                }
            }
        }
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        if(properties.getExternalResourcesDirectory() != null && properties.getExternalResourcesDirectory().exists()) {
            File[] files = properties.getExternalResourcesDirectory().listFiles(File::isDirectory);
            if (files != null) {
                for (File file : files) {
                    registry.addViewController("/" + file.getName() + "/").setViewName("forward:index.html");
                }
            }
        }
    }<% } %>

    @Override
    public void configurePathMatch(PathMatchConfigurer matcher) {
        matcher.setUseRegisteredSuffixPatternMatch(true);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (environment.acceptsProfiles("dev")) {
            registry.addMapping("/**").allowedOrigins("http://localhost:8080")<% if(plugins.security) {%>.exposedHeaders(SECURITY_METHOD)<%}%>;
        }
    }
}
