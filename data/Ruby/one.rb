module ActionController
    module MobileFu
      # These are various strings that can be found in mobile devices.  Please feel free
      # to add on to this list.
      MOBILE_USER_AGENTS =  'palm|blackberry|nokia|phone|midp|mobi|symbian|chtml|ericsson|minimo|' +
                            'audiovox|motorola|samsung|telit|upg1|windows ce|ucweb|astel|plucker|' +
                            'x320|x240|j2me|sgh|portable|sprint|docomo|kddi|softbank|android|mmp|' +
                            'pdxgw|netfront|xiino|vodafone|portalmmm|sagem|mot-|sie-|ipod|up\\.b|' +
                            'webos|amoi|novarra|cdm|alcatel|pocket|ipad|iphone|mobileexplorer|' +
                            'mobile|zune'
  
      def self.included(base)
        base.extend(ClassMethods)
      end
  
      module ClassMethods
  
        def has_mobile_fu(test_mode = false)
          include ActionController::MobileFu::InstanceMethods
  
          if test_mode
            before_filter :force_mobile_format
          else
            before_filter :set_mobile_format
          end
  
          helper_method :is_mobile_device?
          helper_method :in_mobile_view?
          helper_method :is_device?
        end
  
        def is_mobile_device?
          @@is_mobile_device
        end
  
        def in_mobile_view?
          @@in_mobile_view
        end
  
        def is_device?(type)
          @@is_device
        end
      end