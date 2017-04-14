package <%= package %>.web;

import <%= package %>.config.AngutestProperties;

import com.codahale.metrics.annotation.Timed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

/**
 * Web service controller
 */
@RestController
@RequestMapping(path = "/api")
public class <%= nameCap %>Controller {

	@Autowired
	private <%= nameCap %>Properties config;

	@Timed(name = "me")
	@RequestMapping(method = RequestMethod.GET, path = "/me")
	public ResponseEntity<Principal> me(Principal principal) {
		return ResponseEntity.ok().body(principal);
	}

	@Timed(name = "welcome")
	@RequestMapping(method = RequestMethod.GET, path = "/welcome")
	public String welcome() {
		return "{\"title\":\"Anguboot is awesome !\"}";
	}

}
