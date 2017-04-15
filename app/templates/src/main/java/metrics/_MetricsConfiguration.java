package <%= package %>.metrics;

import <%= package %>.jpa.TimerRepository;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.codahale.metrics.MetricRegistry;
import com.ryantenney.metrics.spring.config.annotation.MetricsConfigurerAdapter;

@Configuration
public class MetricsConfiguration
		extends MetricsConfigurerAdapter {

	@Autowired
	private TimerRepository timerRepository;

	@Override
	public void configureReporters(MetricRegistry metricRegistry) {
		registerReporter(
				new DatabaseReporter(metricRegistry, "database-reporter", (name, metric) -> name.startsWith("<%= package %>."), TimeUnit.SECONDS,
						TimeUnit.MILLISECONDS, timerRepository)).start(10, TimeUnit.SECONDS);
	}
}
