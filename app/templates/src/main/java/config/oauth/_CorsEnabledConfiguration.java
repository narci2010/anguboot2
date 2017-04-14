package <%= package %>.config.oauth;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerEndpointsConfiguration;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerSecurityConfiguration;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import static <%= package %>.config.FrontBasicAuthenticationEntryPoint.SECURITY_METHOD;

@Profile("oauth")
@Configuration
@Import(AuthorizationServerEndpointsConfiguration.class)
@Order(-1)
public class CorsEnabledConfiguration extends AuthorizationServerSecurityConfiguration {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        CorsConfigurationSource source = corsConfigurationSource();
        http.addFilterBefore(new CorsFilter(source), ChannelProcessingFilter.class);
    }

    private CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:8080");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader(SECURITY_METHOD);
        config.setAllowCredentials(true);
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}