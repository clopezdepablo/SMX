(function(global, smx, Sizzle, LOG){


/**
 *	util method
 *	GET_UNIQUE_ID
 *	returns unique base36 ids strings [0-9]+[a-z]
 *
 *	based on _.uniqueId(), incremental starting at 0
 *	Native Intger.toString only handles up base 36
 *
 *  base36 [0-9]+[a-z]
 *  base62 [0-9]+[a-z]+[A-Z] but requires BigInt.js!
 *
 */

const GET_UNIQUE_ID = function(){ return parseInt(_.uniqueId()).toString(36) };
//const GET_UNIQUE_ID = ()=>{ return bigInt2str(str2bigInt(_.uniqueId()+"",10,0,0),62) };
	
	
var IdAttributeParser = {
  
  /**
   * Parser name
   * @type {String}
   * @protected
   */
  name: 'Id',
  
  /**
   * Selector used to find nodes having matching attributes to be parsed
   * @type {String}
   * @protected
   */
  selector: ':not([id])',
  
  /**
   * Parser function
   * @static
   * @param {XMLNode} xml
   * @return {XMLNode}
   */
  parse: function(xml){
    
    //get ids already in use inside xml
    var nodes_with_id_attr = Sizzle('[id]');
    var ids_in_use = nodes_with_id_attr.map(function(n){ return n.id });
    
    //get nodes matching the parser selector
    var nodes = Sizzle(this.selector, xml);
    
    //includes xml root itself to the list
    if(Sizzle.matchesSelector(xml,this.selector))
      nodes.unshift(xml);
    else
      ids_in_use.push(xml.getAttribute('id'));
    
    //iterate over all matching nodes
    for(var i=0, len=nodes.length; i<len; i++){
      
      //get node
      var node = nodes[i];
      
      //generate an unique id for the node
      var id = GET_UNIQUE_ID();
      while(ids_in_use.indexOf(id)>0)
        id = GET_UNIQUE_ID();
      				
      //add new id to list
      ids_in_use.push(id);
      			
      //set node id
      node.setAttribute('id',id);
      
    }
    
    LOG('ATTRIBUTE PARSER: ID ('+ nodes.length +' nodes)');
    
    return xml;
    
  }
  
};

//expose to smx namespace
smx.AttributeParsers.push(IdAttributeParser);

})(window, window.smx, window.Sizzle, window.log);