/*
 * Copyright (c) Worldline 2017.
 */

package <%= package %>.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Technical error
 */
@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class <%= nameCap %>TechnicalException
		extends Exception {

	private static final long serialVersionUID = 982385681387765757L;

	/**
	 * @param message : message
	 */
	public <%= nameCap %>TechnicalException(String message) {
		super(message);
	}

	/**
	 * @param message : message
	 * @param cause   : cause
	 */
	public <%= nameCap %>TechnicalException(String message, Throwable cause) {
		super(message, cause);
	}
}
