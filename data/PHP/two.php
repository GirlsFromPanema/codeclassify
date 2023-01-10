<?PHP


namespace PHPOnCouch;

use Exception,
	InvalidArgumentException;

/**
 * couch class
 *
 * basics to implement JSON / REST / HTTP CouchDB protocol
 *
 */
class Couch
{

	/**
	 * @var string database source name
	 */
	protected $dsn = '';

	/**
	 * @var array database source name parsed
	 */
	protected $dsn_parsed = null;

	/**
	 * @var array couch options
	 */
	protected $options = null;

	/**
	 * @var array allowed HTTP methods for REST dialog
	 */
	protected $HTTP_METHODS = array('GET', 'POST', 'PUT', 'DELETE', 'COPY');

	/**
	 * @var resource HTTP server socket
	 * @see _connect()
	 */
	protected $socket = NULL;
}
