package <%= package %>.metrics;

import <%= package %>.jpa.Timer;
import <%= package %>.jpa.TimerRepository;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api")
public class MetricsController {

	private static final Logger LOGGER = LoggerFactory.getLogger(MetricsController.class);

	@Autowired
	private TimerRepository timerRepository;

	@RequestMapping(method = RequestMethod.GET, path = "/metrics")
	public ResponseEntity<List<Timer>> metrics(
			@RequestParam(name = "start", required = false) Date start,
			@RequestParam(name = "end", required = false) Date end,
			@RequestParam(name = "limit", required = false) Integer limit
	) {
		LOGGER.info("Request to get all metrics [start={}, end={}, limit={}]", start, end, limit);
		return ResponseEntity.ok(reOrder(timerRepository
				.findByTimeBetweenOrderByTimeDesc(start != null ? start : new Date(0), end != null ? end : new Date(),
						new PageRequest(0, limit != null ? limit : 100))));
	}

	@RequestMapping(method = RequestMethod.GET, path = "/metrics/{name}")
	public ResponseEntity<List<Timer>> metrics(
			@PathVariable(name = "name") String name,
			@RequestParam(name = "start", required = false) Date start,
			@RequestParam(name = "end", required = false) Date end,
			@RequestParam(name = "limit", required = false) Integer limit
	) {
		LOGGER.info("Request to get metrics [name={}, start={}, end={}, limit={}]", name, start, end, limit);
		return ResponseEntity.ok(reOrder(timerRepository
				.findByNameAndTimeBetweenOrderByTimeDesc(name, start != null ? start : new Date(0), end != null ? end : new Date(),
						new PageRequest(0, limit != null ? limit : 100))));
	}

	private List<Timer> reOrder(List<Timer> list) {
		list.sort(Comparator.comparing(Timer::getTime));
		return list;
	}

}