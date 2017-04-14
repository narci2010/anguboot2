package <%= package %>.exception;

/**
 * Applicative error
 */
public class <%= nameCap %>ApplicativeException
		extends Exception {

	private static final long serialVersionUID = 1385761359716993655L;

	/**
	 * @param message : message
	 */
	public <%= nameCap %>ApplicativeException(String message) {
		super(message);
	}

	/**
	 * @param message : message
	 * @param cause   : cause
	 */
	public <%= nameCap %>ApplicativeException(String message, Throwable cause) {
		super(message, cause);
	}
}
