(function(global, smx){

    

    /**
     * Extends SMXNode with utility attribute getters
     * @mixin Node-Metadata
     */
 
    let NodeMetadataInterface = {
                    
        /**
         * Gets the metadata field value for the given associated to the node
         *
         * @memberof Node-Metadata
         * @param {String} key - key name of meta field
         * @param {String=} lang - langcode
         * @return {String}
         */
        meta: function(key, lang){

            var value;

            try{

                value = $meta[this.id][key];

            }
            catch(e){}

            return value;
            
        },


        /**
         * This method is like `meta` but will return an interpolated version
         * using the node as interpolation context object.
         *
         * @memberof Node-Metadata
         * @param {String} key - key name of meta field
         * @param {String=} lang - langcode
         * @return {String}
         */
        interpolate: function(key, lang){

            var str = this.meta(key, lang);

            if(!_.isString(str)) return;

            var settings = { interpolate: /\{\{(.+?)\}\}/g };

            var result;

            try{
                result = _.template(str, this, settings);
            }
            catch(e){}

            return result;


        }

    };


//extends smx fn methods
smx.fn = smx.fn || {};
smx.fn = Object.assign(smx.fn, NodeMetadataInterface);


})(window, window.smx);