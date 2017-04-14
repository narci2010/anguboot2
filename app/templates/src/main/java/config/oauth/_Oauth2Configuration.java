package <%= package %>.config.oauth;

import <%= package %>.config.FrontBasicAuthenticationEntryPoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Profile("oauth")
@Configuration
public class Oauth2Configuration {

    private static final Logger LOGGER = LoggerFactory.getLogger(Oauth2Configuration.class);

    @Configuration
    @Profile("oauth")
    @EnableResourceServer
    protected static class ResourceServerConfiguration
            extends ResourceServerConfigurerAdapter {

        @Override
        public void configure(HttpSecurity http) throws Exception {
            http.exceptionHandling().authenticationEntryPoint(new FrontBasicAuthenticationEntryPoint("oauth"));
            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            http.csrf().disable();
            http.authorizeRequests()
                    .antMatchers("/", "/index.html", "/**/*.js", "/assets/**/*", "/images/**", "/*.woff*", "/*.ttf", "/*.png")
                    .permitAll().anyRequest().authenticated();
            http.logout().logoutRequestMatcher(new AntPathRequestMatcher("/api/logout"))
                    .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK));
            http.headers().frameOptions().sameOrigin();
            http.cors();
        }
    }

    @Configuration
    @Profile("oauth")
    @EnableAuthorizationServer
    protected static class AuthorizationServerConfiguration
            extends AuthorizationServerConfigurerAdapter {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Value("${security.oauth2.resource.accessTokenValiditySeconds:3600}")
        private int accessTokenValiditySeconds;

        @Value("${refreshTokenValiditySeconds:3600}")
        private int refreshTokenValiditySeconds;

        @Override
        public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
            endpoints.authenticationManager(authenticationManager);
        }

        @Override
        public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
            clients.inMemory()
                    .withClient("oauth").secret("secret")
                    .authorizedGrantTypes("authorization_code", "refresh_token", "password")
                    .scopes("read", "write")
                    .accessTokenValiditySeconds(accessTokenValiditySeconds)
                    .refreshTokenValiditySeconds(refreshTokenValiditySeconds);
        }
    }
}
