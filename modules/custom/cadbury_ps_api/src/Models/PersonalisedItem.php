<?php 

namespace Drupal\cadbury_ps_api\Models;

use Drupal\node\Entity\Node;

/**
 * This is the model class for the Personalised content type
 *
 * @property $categories
 * @property $images
 */

class PersonalisedItem extends Option  {

    const TYPE = "personalised_item";
    
    public $images;
    
    /**
     * Returns all the PersonalisedItem records
     *
     * @return array
     */
    public static function getAllItems(){
        $results = [];

        foreach ( self::getAll(self::TYPE) as $node ):
            $results[] = [
                "nid"       =>  (int)$node->id(),
                "type"      =>  self::TYPE,
                "images"    =>  self::getImageStyles($node),
            ];
        endforeach;
        
        return $results;
    }

}