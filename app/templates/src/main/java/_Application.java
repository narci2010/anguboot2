package <%= package %>;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

import com.ryantenney.metrics.spring.config.annotation.EnableMetrics;

/**
 * Main spring boot application
 */
@SpringBootApplication
@EnableMetrics
public class <%= nameCap %>Application {

	/**
	 * @param args program arguments
	 */
	public static void main(String[] args) {
		new SpringApplicationBuilder(<%= nameCap %>Application.class).listeners(new CustomLoggingListener()).run(args);
	}
}
