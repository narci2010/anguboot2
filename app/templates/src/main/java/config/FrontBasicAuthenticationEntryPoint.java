package <%= package %>.config;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Entry point which does not send the header to the browser for authentication
 */
public class FrontBasicAuthenticationEntryPoint extends BasicAuthenticationEntryPoint {

    public static final String SECURITY_METHOD = "X-Security-Method";

    private String security;

    public FrontBasicAuthenticationEntryPoint(String security) {
        super();
        this.security = security;
        this.setRealmName("front-basic-entry-point");
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        // do not send http header to browser
        response.addHeader(SECURITY_METHOD, security);
        response.sendError(401, authException.getMessage());
    }
}
