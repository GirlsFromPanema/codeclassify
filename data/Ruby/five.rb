module ActiveRestClient
    class Base
      include Mapping
      include Configuration
      include RequestFiltering
      include Validation
      include Caching
      include Recording
  
      attr_accessor :_status
      attr_accessor :_etag
      attr_accessor :_headers
  
      instance_methods.each do |m|
        next unless %w{display presence load require hash untrust trust freeze method enable_warnings with_warnings suppress capture silence quietly debugger breakpoint}.map(&:to_sym).include? m
        undef_method m
      end
  
      def initialize(attrs={})
        @attributes = {}
        @dirty_attributes = Set.new
  
        raise Exception.new("Cannot instantiate Base class") if self.class.name == "ActiveRestClient::Base"
  
        attrs.each do |attribute_name, attribute_value|
          attribute_name = attribute_name.to_sym
          if attribute_value.to_s[/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6]))))$/]
            @attributes[attribute_name] = Date.parse(attribute_value)
          elsif attribute_value.to_s[/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/]
            @attributes[attribute_name] = DateTime.parse(attribute_value)
          else
            @attributes[attribute_name] = attribute_value
          end
          @dirty_attributes << attribute_name
        end
      end
  
      def _clean!
        @dirty_attributes = Set.new
      end
  
      def _attributes
        @attributes
      end
  
      def _copy_from(result)
        @attributes =  result._attributes
        @_status = result._status
      end
  
      def dirty?
        @dirty_attributes.size > 0
      end
  
      def errors
        @attributes[:errors] || (_errors != {} ? _errors : nil)
      end
  
      def self._request(request, method = :get, params = nil)
        prepare_direct_request(request, method).call(params)
      end
  
      def self._plain_request(request, method = :get, params = nil)
        prepare_direct_request(request, method, plain:true).call(params)
      end
  
      def self._lazy_request(request, method = :get, params = nil)
        ActiveRestClient::LazyLoader.new(prepare_direct_request(request, method), params)
      end
  
      def self.prepare_direct_request(request, method, options={})
        unless request.is_a? ActiveRestClient::Request
          options[:plain] ||= false
          mapped = {url:"DIRECT-CALLED-#{request}", method:method, options:{url:request, plain:options[:plain]}}
  
          request = Request.new(mapped, self)
        end
        request
      end