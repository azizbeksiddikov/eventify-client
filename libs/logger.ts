/**
 * Comprehensive logging utility for the Eventify frontend
 * Provides structured logging with different log levels and context
 */

export enum LogLevel {
	DEBUG = "DEBUG",
	INFO = "INFO",
	WARN = "WARN",
	ERROR = "ERROR",
}

export interface LogContext {
	[key: string]: unknown;
}

class Logger {
	private isDevelopment: boolean;
	private isProduction: boolean;

	constructor() {
		this.isDevelopment = process.env.NODE_ENV === "development";
		this.isProduction = process.env.NODE_ENV === "production";
	}

	/**
	 * Formats log message with timestamp and context
	 */
	private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
		const timestamp = new Date().toISOString();
		const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : "";
		return `[${timestamp}] [${level}] ${message}${contextStr}`;
	}

	/**
	 * Logs debug messages (only in development)
	 */
	debug(message: string, context?: LogContext): void {
		if (this.isDevelopment) {
			console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
		}
	}

	/**
	 * Logs informational messages
	 */
	info(message: string, context?: LogContext): void {
		console.info(this.formatMessage(LogLevel.INFO, message, context));
	}

	/**
	 * Logs warning messages
	 */
	warn(message: string, context?: LogContext): void {
		console.warn(this.formatMessage(LogLevel.WARN, message, context));
	}

	/**
	 * Logs error messages
	 */
	error(message: string, error?: Error | unknown, context?: LogContext): void {
		const errorContext: LogContext = {
			...(context || {}),
			...(error instanceof Error
				? {
						errorName: error.name,
						errorMessage: error.message,
						errorStack: error.stack,
					}
				: error
					? { error: String(error) }
					: {}),
		};
		console.error(this.formatMessage(LogLevel.ERROR, message, errorContext));
	}

	/**
	 * Logs GraphQL operation (query/mutation)
	 */
	logGraphQLOperation(
		operation: "query" | "mutation" | "subscription",
		operationName: string,
		variables?: Record<string, unknown>,
		context?: LogContext,
	): void {
		this.info(`GraphQL ${operation.toUpperCase()}: ${operationName}`, {
			...context,
			operation,
			operationName,
			variables: variables ? this.sanitizeVariables(variables) : undefined,
		});
	}

	/**
	 * Logs GraphQL operation success
	 */
	logGraphQLSuccess(
		operation: "query" | "mutation" | "subscription",
		operationName: string,
		duration?: number,
		context?: LogContext,
	): void {
		this.info(`GraphQL ${operation.toUpperCase()} SUCCESS: ${operationName}`, {
			...context,
			operation,
			operationName,
			duration: duration ? `${duration}ms` : undefined,
		});
	}

	/**
	 * Logs GraphQL operation error
	 */
	logGraphQLError(
		operation: "query" | "mutation" | "subscription",
		operationName: string,
		error: Error | unknown,
		context?: LogContext,
	): void {
		this.error(`GraphQL ${operation.toUpperCase()} ERROR: ${operationName}`, error, {
			...context,
			operation,
			operationName,
		});
	}

	/**
	 * Logs authentication events
	 */
	logAuth(event: string, context?: LogContext): void {
		this.info(`AUTH: ${event}`, { ...context, authEvent: event });
	}

	/**
	 * Logs user interactions
	 */
	logUserAction(action: string, context?: LogContext): void {
		this.debug(`USER ACTION: ${action}`, { ...context, userAction: action });
	}

	/**
	 * Logs component lifecycle events
	 */
	logComponentLifecycle(component: string, lifecycle: "mount" | "unmount" | "update", context?: LogContext): void {
		this.debug(`COMPONENT ${lifecycle.toUpperCase()}: ${component}`, {
			...context,
			component,
			lifecycle,
		});
	}

	/**
	 * Logs API calls
	 */
	logAPICall(method: string, url: string, context?: LogContext): void {
		this.info(`API CALL: ${method} ${url}`, { ...context, method, url });
	}

	/**
	 * Logs API call success
	 */
	logAPISuccess(method: string, url: string, status: number, duration?: number, context?: LogContext): void {
		this.info(`API SUCCESS: ${method} ${url}`, {
			...context,
			method,
			url,
			status,
			duration: duration ? `${duration}ms` : undefined,
		});
	}

	/**
	 * Logs API call error
	 */
	logAPIError(method: string, url: string, error: Error | unknown, context?: LogContext): void {
		this.error(`API ERROR: ${method} ${url}`, error, { ...context, method, url });
	}

	/**
	 * Sanitizes variables to remove sensitive data
	 */
	private sanitizeVariables(variables: Record<string, unknown>): Record<string, unknown> {
		const sensitiveKeys = ["password", "memberPassword", "token", "accessToken", "jwtToken", "secret"];
		const sanitized = { ...variables };

		for (const key of Object.keys(sanitized)) {
			if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive.toLowerCase()))) {
				sanitized[key] = "[REDACTED]";
			}
		}

		return sanitized;
	}

	/**
	 * Logs performance metrics
	 */
	logPerformance(metric: string, duration: number, context?: LogContext): void {
		this.info(`PERFORMANCE: ${metric}`, {
			...context,
			metric,
			duration: `${duration}ms`,
		});
	}

	/**
	 * Logs navigation events
	 */
	logNavigation(from: string, to: string, context?: LogContext): void {
		this.debug(`NAVIGATION: ${from} -> ${to}`, { ...context, from, to });
	}
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, error?: Error | unknown, context?: LogContext) =>
	logger.error(message, error, context);
