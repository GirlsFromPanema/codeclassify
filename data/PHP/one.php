require_once 'Rediska/Connection.php';

/**
 * @see Rediska_KeyDistributor_Interface
 */
require_once 'Rediska/KeyDistributor/Interface.php';

/**
 * @see Rediska_KeyDistributor_Exception
 */
require_once 'Rediska/KeyDistributor/Exception.php';

/**
 * @package Rediska
 * @author Kijin Sung <kijinbear@gmail.com>
 * @link http://github.com/kijin/distrib
 * @version 0.1.1
 * @link http://rediska.geometria-lab.net
 * @licence http://www.opensource.org/licenses/bsd-license.php
 */
class Rediska_KeyDistributor_ConsistentHashing implements Rediska_KeyDistributor_Interface
{
    protected $_backends = array();
    protected $_backendsCount = 0;

    protected $_hashring = array();
    protected $_hashringCount = 0;

    protected $_replicas = 256;
    protected $_slicesCount = 0;
    protected $_slicesHalf = 0;
    protected $_slicesDiv = 0;

    protected $_cache = array();
    protected $_cacheCount = 0;
    protected $_cacheMax = 256;

    protected $_hashringIsInitialized = false;

    /**
     * (non-PHPdoc)
     * @see Rediska_KeyDistributor_Interface#addConnection
     */
    public function addConnection($connectionString, $weight = Rediska_Connection::DEFAULT_WEIGHT)
    {
        if (isset($this->_backends[$connectionString])) {
            throw new Rediska_KeyDistributor_Exception("Connection '$connectionString' already exists.");
        }

        $this->_backends[$connectionString] = $weight;

        $this->_backendsCount++;

        $this->_hashringIsInitialized = false;

        return $this;
    }

    /**
     * (non-PHPdoc)
     * @see Rediska_KeyDistributor_Interface#removeConnection
     */
    public function removeConnection($connectionString)
    {
        if (!isset($this->_backends[$connectionString])) {
            throw new Rediska_KeyDistributor_Exception("Connection '$connectionString' not exist.");
        }

        unset($this->_backends[$connectionString]);

        $this->_backendsCount--;
        
        $this->_hashringIsInitialized = false;

        return $this;
    }
}