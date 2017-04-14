package <%= package %>.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * Basic security configuration
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration
        extends WebSecurityConfigurerAdapter {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfiguration.class);

    private static final String COOKIE_SESSION_ID = "ANGUTEST-JSESSIONID";

    @Autowired
    private Environment environment;

    @Bean
    public ServletContextInitializer servletContextInitializer() {
        return servletContext -> servletContext.getSessionCookieConfig().setName(COOKIE_SESSION_ID);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        if (environment.acceptsProfiles("oauth")) {
            LOGGER.debug("OAuth security");
            http.httpBasic().realmName("oauth")
                    .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and().requestMatchers().antMatchers("/oauth/authorize")
                    .and().authorizeRequests()
                    .antMatchers("/oauth/authorize").authenticated();
        } else {
            LOGGER.debug("Basic security");
            http.httpBasic().authenticationEntryPoint(new FrontBasicAuthenticationEntryPoint("basic"));
            http.csrf().disable();
            http.authorizeRequests()
                    .antMatchers("/", "/index.html", "/**/*.js", "/assets/**/*", "/images/**", "/*.woff*", "/*.ttf", "/*.png")
                    .permitAll().anyRequest().authenticated();
            http.logout().invalidateHttpSession(true).deleteCookies(COOKIE_SESSION_ID)
                    .logoutRequestMatcher(new AntPathRequestMatcher("/api/logout"))
                    .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK));
            http.headers().frameOptions().sameOrigin();
        }
        if (environment.acceptsProfiles("dev")) {
            LOGGER.debug("Enabling cors");
            http.cors();
        }
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication().withUser("user").password("password").roles("USER");
        auth.inMemoryAuthentication().withUser("actuator").password("password").roles("ACTUATOR");
        auth.inMemoryAuthentication().withUser("admin").password("admin").roles("ADMIN", "ACTUATOR");
    }
}
