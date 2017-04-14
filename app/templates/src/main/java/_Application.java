/*
 * Copyright (c) Worldline 2017.
 */

package <%= package %>;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

/**
 * Main spring boot application
 */
@SpringBootApplication
public class <%= nameCap %>Application {

	/**
	 * @param args : program arguments
	 */
	public static void main(String[] args) {
		new SpringApplicationBuilder(<%= nameCap %>Application.class).listeners(new CustomLoggingListener()).run(args);
	}
}
