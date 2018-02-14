import Eventify from 'eventify';


/**
* SMX Playhead class
* @memberof smx
*/
class Playhead{

	/**
	 * Create a playhead
	 * @param {SMXDocument} document - The document to navigate through
	 */
	constructor(doc){
    
		//document is required
		if(!doc) return;
    
		//extend with events on, off, trigger
		Eventify.enable(this);
    
		/**
		 * The document to navigate through
		 * @type {SMXDocument}
		 * @private
		 */
		this._document = doc;
		
		/**
		 * Contains all currently selected nodes ordered from outter to inner.
		 * @type {SMXNode[]}
		 * @private
		 */
		this._selection = [];

	}


	/**
	 * Gets the associated document
	 * @type {SMXDocument}
	 * @readonly
	 */
	get document(){
		return this._document;
	}


	/**
	 * Gets all currently selected nodes ordered from outter to inner.
	 * @type {SMXNode}
	 * @readonly
	 */
	get selection() {
		return this._selection;
	}

	/**
	 * Gets the head node, which is the last node in the path.
	 * @type {SMXNode}
	 * @readonly
	 */
	get head(){
		return this._selection[this._selection.length - 1];
	}

	/**
	 * Gets the root node, which is the first node in the path.
	 * @type {SMXNode}
	 * @readonly
	 */
	get root(){
		return this._selection[0];
	}

	/**
	 * Navigates to document's root node.
	 */
  reset() {
    return this.navigate(this.document.root);
  }

	/**
	 * Performs play action
	 * @param {(String|SMXNode)=} ref target reference
	 */
	play(ref){
    
		//no reference? just do a forward
		if(!ref) return this.forward();
		
		//resolve target node
		var tnode = (ref.id)? ref : this.document.getNodeById(ref);
    
		//not found? ignore...
		if(tnode) return this.navigate(tnode,{});
		
		//else ignore
		return;
    
  }
  
  /**
   * Navigates inside head's node.
   */
  enter(){
    
    //get current node
    var cnode = this.head; if(!cnode) return;
    
    //get children nodes
    let children = cnode.children;
    
    //no children?
    if (!children.length) return;
    
    //get first child
    var tnode = children[0];
    
    //go to child node using known swap type and passing recived params
    return this.navigate(tnode,{ 'type':'inside' });
    
  }

  /**
   * Navigates outside head's node.
   */
  exit(){
    
    //get current node
    var cnode = this.head; if(!cnode) return;
    
    //has parent node?
    if(!cnode.parent) return;
    
    //get parent node
    var tnode = cnode.parent;
    
    //go to child node using known swap type and passing recived params
    return this.navigate(tnode,{ 'type':'outside' });
    
  }

	/**
	 * Navigates to head's next node.
	 */
  next(){
		
		//get current node
		var cnode = this.head; if(!cnode) return;

		//get next node
		var tnode = cnode.next; if (!tnode) return;
		
		//go to next node using known swap type
		return this.navigate(tnode,{'type':'next'});
		
	}

	/**
	 * Navigates to head's previous node.
	 */
	previous(){
		
		//get current node
		var cnode = this.head; if(!cnode) return;
    
		//get previous node
		var tnode = cnode.previous; if (!tnode) return;
    
		//go to previous node using known swap type and passing recived params
		return this.navigate(tnode,{'type':'previous'});
		
	}
	
	/**
	 * Navigates to head's next node in flat tree mode.
	 */
	forward(){
		
		let tnode, cnode, children;
		
		//get current node
		cnode = this.head;
		
		//no current node? ignore
		if(!cnode) return;
    
		tnode = cnode.first || cnode.next;
    
		if(!tnode){
      
			var parent = cnode.parent;
			while(parent && !tnode){
				tnode = parent.next;
				parent = parent.parent;
			}
      
    }
    
    return (tnode)? this.navigate(tnode) : null;
    
	}
  
	/**
   * Navigates to head's previous node in flat tree mode.
	 */
  backward(){
    
		if(!this.head) return;
    var tnode = this.head.previous || this.head.parent
    return (tnode)? this.navigate(tnode) : null;
    
	}

	/**
	 * Executes a playhead action by keyword.
   * @param {String} keyword
	 */
	exec(keyword){
    	  
		//define valid keywords mapping existing methods
		var keywords = [
		  'reset', 'play', 'next', 'previous',
		  'enter', 'exit', 'forward', 'backward'
		];
    
    //resolve for a valid keyword
    var isValidKeyword = (keywords.indexOf(keyword)>=0);
    
    //not valid keyword? error!
		if(!isValidKeyword)
		  throw new Error( 'UNKNOWN KEYWORD "!"'+ keyword +'"' );
    
    //try-catched execution
		try{ return this[keyword]()	}
		catch(e){	throw new Error( 'Playhead Error: Keyword exec "!'+ keyword +'"', e) }
    
	}

	/**
	 * Navigates to given node using optional configuration.
   * @param {String} target
	 */
  navigate(target){

		//check for a keyword, must be '!' preffixed string
    var isKeyword = (typeof target === 'string' && target.indexOf('!') === 0);
		
		//keyword? resolve by exec unpreffixed reference
		if(isKeyword)
      return this.exec(target.substr(1));
    
		//resolve target node by reference
		//assuming having and id property means SMXNode...
    var tnode = (target.id) ? target : this.document.getNodeById(target);
    
    //no target found? error!
		if(!tnode)
      throw new Error('Playhead Error: Invalid target ' + target);
		
		//get current node
		var cnode = this.head;
		
		//no need to move...
		if(tnode === cnode) return cnode;
		
    //--> ASYNC ATTR CONDITIONAL NAVIGATION WAS HERE...
    //see leagacy playhead implementations for more info
    
    //resets private navigation registry
		var selected = [], deselected = [];
    
    
    if(!cnode){
      cnode = this.document.root;
      selected.push(cnode);
    }
		
		/* trying a better approach */
		
		var isDescendant = cnode.isAncestorOf(tnode);
		var isAncestor = tnode.isAncestorOf(cnode);
    
    //aux filter fn for later use
		var isNodeOrAncestorOf = (n) => (n==tnode || n.isAncestorOf(tnode));
		
		var r = cnode;
		if(cnode === tnode){
		  //..
		}
		else if(isDescendant){
		  while(r!=tnode){
		    r = r.children.filter(isNodeOrAncestorOf)[0]
		    selected.push(r);
		  }
		}
		else if(isAncestor){
		  while(r!=tnode){
		    deselected.push(r);
		    r = r.parent;
		  }
		}
		else{
		  while(!r.isAncestorOf(cnode) || !r.isAncestorOf(tnode)){
		    deselected.push(r);
		    r = r.parent;
		  }
		  while(r!=tnode){
		    r = r.children.filter(isNodeOrAncestorOf)[0]
		    selected.push(r);
		  }
		}
		
		
		//update path
		for(var i=0; i<deselected.length; i++){
		  this._selection.pop();
		}
		for(var i=0; i<selected.length; i++){
		  this._selection.push(selected[i]);
		}


    this.trigger('change',{
      selected: selected,
      deselected: deselected,
      path: this._selection,
      origin: cnode,
      target: tnode
    });
    
		/*
		//FIRE EVENTS
    
		//FIRE 'LEAVE' EVENT
		if(cnode){
      
			//fire generic 'leave' event in resulting current node
			this.trigger('leave', cnode);
			
			//fire specific node 'leave' event
			this.trigger('leave:'+cnode.id, cnode);
			
		}
    
		//--> NOSTOP ATTRIBUTE CONDITIONAL NAVIGATION WAS HERE...
    //see leagacy playhead implementations for more info
    
		//fire generic 'stay' event in resulting current node
		this.trigger('stay',tnode);
		
		//fire specific node 'stay' event
		this.trigger('stay:'+tnode.id,tnode);
    
		//notify node navigation completed
		this.trigger('ready',tnode);
    
    //return head node
		return this.head;
		
		*/
		
	}


	/**
	 * Fired when entering to any node
	 * @event enter
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

	/**
	 * Fired just after `enter` but for a specific node
	 * @event enter:id
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

	/**
	 * Fired when exiting from any node
	 * @event exit
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

	/**
	 * Fired just after `exit` but for a specific node
	 * @event exit:id
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

	/**
	 * Fired every time a head change occurs and stays on any node
	 * @event stay
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

	/**
	 * Fired just after `stay` but for a specific node
	 * @event stay:id
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

	/**
	 * Fired every time a node stops being the head
	 * @event leave
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

	/**
	 * Fired just after `leave` but for a specific node
	 * @event leave:id
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

	/**
	 * Fired every time the playhead finishes all operations and goes idle
	 * @event ready
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

	/**
	 * Fired when playhed goes to sync mode
	 * @event sync
	 * @memberof smx.Playhead
	 * @return {PlayheadEvent}
	 */

}



export default Playhead;