package com.ano.project.config;

import com.ano.project.service.UsuarioService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Configuration
public class SecurityConfig {

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationManager authenticationManager(UsuarioService usuarios, PasswordEncoder encoder) {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(usuarios);
		provider.setPasswordEncoder(encoder);
		return new ProviderManager(provider);
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.cors(Customizer.withDefaults())
				.csrf(Customizer.withDefaults())
				.formLogin(form -> form.disable())
				.httpBasic(basic -> basic.disable())
				.logout(logout -> logout.disable())
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.GET, "/api/v1/auth/csrf").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/v1/auth/logout").permitAll()
						.anyRequest().authenticated())
				.exceptionHandling(erros -> erros
						.authenticationEntryPoint((request, response, erro) ->
								escreverErro(response, 401, "NAO_AUTENTICADO", "Autenticação necessária."))
						.accessDeniedHandler((request, response, erro) ->
								escreverErro(response, 403, "ACESSO_NEGADO", "Acesso negado.")));
		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource(AplicacaoProperties properties) {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(properties.getCors().getAllowedOrigins());
		config.setAllowedMethods(List.of("GET", "POST", "PATCH", "OPTIONS"));
		config.setAllowedHeaders(List.of("Content-Type", "X-CSRF-TOKEN"));
		config.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", config);
		return source;
	}

	private void escreverErro(HttpServletResponse response, int status, String codigo, String mensagem) throws IOException {
		response.setStatus(status);
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");
		response.getWriter().printf("{\"codigo\":\"%s\",\"mensagem\":\"%s\",\"campos\":{},\"traceId\":\"%s\"}",
				codigo, mensagem, UUID.randomUUID());
	}
}
