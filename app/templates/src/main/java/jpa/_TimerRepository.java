package <%= package %>.jpa;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface TimerRepository
		extends CrudRepository<Timer, Long> {

	List<Timer> findByTimeBetweenOrderByTimeDesc(Date start, Date end, Pageable page);

	List<Timer> findByNameAndTimeBetweenOrderByTimeDesc(String name, Date start, Date end, Pageable page);

}
