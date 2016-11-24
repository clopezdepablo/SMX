////////////////////////////////
// smx plugin
// METADATA PARSER
// will transform all <metadata> nodes
// convert first level children nodes into meta-* attributes
// and apply those attributes to direct parent node


(function(global){
 

    //private aux debug system
    var DEBUG = true; var LOG = function(str){ if (global.console&&global.console.log&&DEBUG) global.console.log('METADATA: '+str) };


    //local smx ref
    var smx = global.smx;


    ////////////////////////////////
    // PRIVATE SELECTOR ENGINE SHORTCUT
    // defined out of constructor, so multiple SMXDocuments will use same shortcut instance

    var _SIZZLE = global.Sizzle;


    var MetadataParser = {};


    //local helper
    var escapeHtml = function(text) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }


    MetadataParser.parseXML = function(xml, opt){

        var XML = xml;

        //validate XML
        if(!XML) return;

        //normalize options
        var options = _.extend({
            data: {},
            callback: function(){ return },
            total: 0,
            nodes: null,
            max_iterations: 100
        },opt);


        // get all unparsed nodes based on flag attr
        // `metadata-processed` attribute is added while parsing process
        // nodes missing the flag attr are the nodes we need to parse
        var nodes;
        if(!options.nodes) nodes = _SIZZLE('*:not([metadata-processed]):not([type="html"]):not([type="html"] *)', XML);
        else nodes = options.nodes;


        //calculate percent progress
        if(nodes.length > options.total) options.total = nodes.length;
        var percent =  Math.floor(100 - (nodes.length*100) / options.total);


        LOG('PARSING... ('+ (options.total-nodes.length) +'/'+ options.total +') '+percent+'%');


        var i = 0;

        while(nodes.length && i<options.max_iterations){

            var node = nodes.shift();

            var result;

            if(node.nodeType==1){

                result = (node.nodeName == 'metadata' )? this.parseMetadataNode(node) : this.parseMetaAttributes(node);

                if(result){

                    //create node data object if does not exists yet
                    if (!options.data[result.id]) options.data[result.id] = {};

                    //extend parent data object
                    if(!_.isEmpty(result.data)) _.extend(options.data[result.id], result.data);

                }

            }


            i++;

        }


        //more nodes to parse?
        if(nodes.length){

            _.delay(_.bind(function(){ this.parseXML(XML,{
                data: options.data,
                callback: options.callback,
                total: options.total,
                nodes: nodes
            }) },this),0);

        }
        //complete! no more nodes to parse
        else{

            //remove all existing metadata-processed attributes
            LOG( 'REMOVING FLAGS...' );
            var flagged_nodes = _SIZZLE('[metadata-processed]', XML);
            _.each(flagged_nodes,function(node){
                node.removeAttribute('metadata-processed')
            });

            LOG( 'COMPLETE! ('+ options.total +'/'+ options.total +') 100%' );

            try{
                
                options.callback(XML,options.data);

            }catch(e){

                LOG( 'CALLBACK ERROR! '+ e.toString() );
            }
        }


        return
    }


    MetadataParser.parseMetadataNode = function(node){

        if(!node) return;
 
        //is metadata node??
        if(node.nodeName!='metadata') return;

        //get direct metadata parent node
        var parent = node.parentNode;

        //no parent node? wtf!!
        if(!parent) return;

        //node id which to attach data parsed
        var id = parent.getAttribute('id');

        //instance returning data object
        var data = {};


        //get and remove metadata node from parent
        var md = parent.removeChild(node);

        for (var c =0; c<md.childNodes.length; c++){

            var xmlNode = md.childNodes[c];

            var key = xmlNode.nodeName;

            var value;

            if (xmlNode.innerHTML){

                //is <![CDATA ???
                var is_cdata = ( (xmlNode.innerHTML+'').indexOf('<![CDATA') >= 0 );

                if(is_cdata){

                    var _chilNodes = xmlNode.childNodes;

                    var _cdata, i=0;

                    while(!_cdata && i<_chilNodes.length){

                        var _node = _chilNodes[i];

                        if(_node && _node.nodeType === 4 ) _cdata = _node;

                        i++
                    }

                    if(_node)   value = escapeHtml(_cdata.textContent+'');
                    else        value = xmlNode.innerHTML;

                }
                else{

                    value = xmlNode.innerHTML;

                }

            }
            else{

                var childs = xmlNode.childNodes;

                var str = '';

                if (childs.length){
                    _.each(childs,function(item,index){
                        str+= item.xml || (new XMLSerializer()).serializeToString(item);
                    });
                }

                value = str;

            }

            //ignore text nodes, comment nodes, ...
            if(xmlNode.nodeType==1) data[key] = value;

        }


        return {
            'data': data,
            'id': id
        }

        
    }


    MetadataParser.parseMetaAttributes = function(node){

        if(!node) return;
 
        //instance the resultant data object
        var data = {};

        //node id which to attach data parsed
        var id = node.getAttribute('id');

        //get data from node attributes
        var attrs = node.attributes;
        var data = {};

        var attr_names = _.pluck(attrs,'name');
        var attr_values = _.pluck(attrs,'value');

        var len = attrs.length;

        for(var i = 0; i < len; i++) {
            var attr_name = attr_names[i];
            var attr_value = attr_values[i];
            if(attr_name.indexOf("meta-") == 0){
                attr_name = attr_name.substr(5);
                data[attr_name] = attr_value;

                node.removeAttribute("meta-"+attr_name);
            }
                
        }


        //add "metadata-processed" flag attr
        node.setAttribute('metadata-processed','true');


        return {
            'data': data,
            'id': id
        }
        

       
    }


    //expose into global smx namespace
    smx.meta = MetadataParser;



})(window);