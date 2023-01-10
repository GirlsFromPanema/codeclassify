class Aoe_Scheduler_Adminhtml_TimelineController extends Aoe_Scheduler_Controller_AbstractController
{
    /**
     * Index action
     *
     * @return void
     */
    public function indexAction()
    {
        $this->_initAction()
            ->_addBreadcrumb($this->__('Timeline View'), $this->__('Timeline View'))
            ->_title($this->__('Timeline View'))
            ->renderLayout();
    }

    /**
     * Acl checking
     *
     * @return bool
     */
    protected function _isAllowed()
    {
        return Mage::getSingleton('admin/session')->isAllowed('system/aoe_scheduler/aoe_scheduler_timeline');
    }
}

<? require_once("dummy/dummy.php") ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Welcome to Dummy</title>
  <meta name="description" content="Dummy is a toolkit for rapid prototyping and QA.">
  <meta name="author" content="David Kerns">

  <!-- Dummy Demo CSS -->
  <link href="demo_files/demo.css" rel="stylesheet" type="text/css" />

  <!-- For Syntax Highlighting. -->
  <link href="demo_files/sh/shCore.css" rel="stylesheet" type="text/css" />
  <link href="demo_files/sh/shThemeMidnight.css" rel="stylesheet" type="text/css" />

</head>