package <%= package %>;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.bind.RelaxedPropertyResolver;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.GenericApplicationListener;
import org.springframework.core.Ordered;
import org.springframework.core.ResolvableType;

/**
 * Custom listener which transforms all logging.* properties into LOGGING_* for logback configuration file
 */
public class CustomLoggingListener
		implements GenericApplicationListener {

	public static final int DEFAULT_ORDER = Ordered.HIGHEST_PRECEDENCE + 19;

	@Override
	public void onApplicationEvent(ApplicationEvent e) {
		if (e instanceof ApplicationEnvironmentPreparedEvent) {
			ApplicationEnvironmentPreparedEvent event = (ApplicationEnvironmentPreparedEvent) e;
			Map<String, Object> loggingProperties = new RelaxedPropertyResolver(event.getEnvironment()).getSubProperties("logging.");
			loggingProperties.forEach((k, v) -> System.setProperty(k.replace(".", "_").toUpperCase(), String.valueOf(v)));
		}
	}

	@Override
	public boolean supportsEventType(ResolvableType resolvableType) {
		return ApplicationEnvironmentPreparedEvent.class.isAssignableFrom(resolvableType.getRawClass());
	}

	@Override
	public boolean supportsSourceType(Class<?> sourceType) {
		return SpringApplication.class.isAssignableFrom(sourceType);
	}

	@Override
	public int getOrder() {
		return DEFAULT_ORDER;
	}
}
