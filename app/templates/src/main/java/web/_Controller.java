package <%= package %>.web;

import com.codahale.metrics.annotation.Timed;<% if (plugins.security) { %>
import java.security.Principal;<%}%>
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Web service controller
 */
@RestController
@RequestMapping(path = "/api")
public class <%= nameCap %>Controller {<% if (plugins.security) { %>

	@Timed(name = "me")
	@RequestMapping(method = RequestMethod.GET, path = "/me")
	public ResponseEntity<Principal> me(Principal principal) {
		return ResponseEntity.ok().body(principal);
	}<%}%>

	@Timed(name = "welcome")
	@RequestMapping(method = RequestMethod.GET, path = "/welcome")
	public String welcome() {
		return "{\"title\":\"Anguboot is awesome !\"}";
	}

}
