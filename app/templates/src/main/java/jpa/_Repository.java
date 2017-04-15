package <%= package %>.jpa;

import org.springframework.data.repository.CrudRepository;

public interface <%= nameCap %>Repository
		extends CrudRepository<<%= nameCap %>Entity, Long> {

}
