class Danslo_ApiImport_Model_Import_Api
    extends Mage_Api_Model_Resource_Abstract
{

    /**
     * Cached import model.
     *
     * @var Mage_ApiImport_Model_Import
     */
    protected $_api;

    /**
     * @var Mage_Catalog_Model_Resource_Eav_Mysql4_Setup
     */
    protected $_setup;

    /**
     * @var int
     */
    protected $_catalogProductEntityTypeId;

    /**
     * Sets up the import model and loads area parts.
     *
     * @return void
     */
    public function __construct()
    {
        $this->_api = Mage::getModel('api_import/import');

        // Event part is not loaded by default for API.
        Mage::app()->loadAreaPart(Mage_Core_Model_App_Area::AREA_GLOBAL, Mage_Core_Model_App_Area::PART_EVENTS);
    }

    /**
     * Fires off the import process through the import model.
     *
     * @param array $entities
     * @param string $entityType
     * @param string $behavior
     * @return array
     */
    public function importEntities($entities, $entityType = null, $behavior = null)
    {
        $this->_setEntityTypeCode($entityType ? $entityType : Mage_Catalog_Model_Product::ENTITY);
        $this->_setBehavior($behavior ? $behavior : Mage_ImportExport_Model_Import::BEHAVIOR_REPLACE);

        $this->_api->getDataSourceModel()->setEntities($entities);
        try {
            $result = $this->_api->importSource();
            $errorsCount = $this->_api->getErrorsCount();
            if ($errorsCount > 0) {
                Mage::throwException("There were {$errorsCount} errors during the import process." .
                    "Please be aware that valid entities were still imported.");
            };
        } catch(Mage_Core_Exception $e) {
            $this->_fault('import_failed', $e->getMessage());
        }

        return array($result);
    }