package <%= package %>.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.web.DispatcherServletAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.*;

import javax.annotation.PostConstruct;
import java.io.File;

import static <%= package %>.config.FrontBasicAuthenticationEntryPoint.SECURITY_METHOD;

/**
 * Web mvc configuration
 */
@Configuration
@AutoConfigureAfter(DispatcherServletAutoConfiguration.class)
public class WebMvcConfiguration
        extends WebMvcConfigurerAdapter {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebMvcConfiguration.class);

    @Autowired
    private AngutestProperties config;

    @Autowired
    private Environment environment;

    @PostConstruct
    public void init() {
        LOGGER.info("Looking for specific client configurations in [{}]", config.getExternalResourcesDirectory().getAbsolutePath());
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer matcher) {
        matcher.setUseRegisteredSuffixPatternMatch(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String defaultPath = "classpath:/public/";
        File[] files = config.getExternalResourcesDirectory().listFiles(File::isDirectory);
        if (files != null) {
            for (File file : files) {
                String resourceHandler = "/" + file.getName() + "/**";
                String location = "file:" + new File(config.getExternalResourcesDirectory(), file.getName()) + "/";
                LOGGER.debug("Resources handler [{}], add location [{}]", resourceHandler, location);
                registry.addResourceHandler(resourceHandler)
                        .addResourceLocations(location, defaultPath)
                        .setCachePeriod(config.getExternalResourcesCacheTime());
            }
        }
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        File[] files = config.getExternalResourcesDirectory().listFiles(File::isDirectory);
        if (files != null) {
            for (File file : files) {
                registry.addViewController("/" + file.getName() + "/").setViewName("forward:index.html");
            }
        }
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (environment.acceptsProfiles("dev")) {
            registry.addMapping("/**").allowedOrigins("http://localhost:8080").exposedHeaders(SECURITY_METHOD);
        }
    }
}
