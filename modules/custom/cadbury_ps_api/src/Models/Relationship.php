<?php 

namespace Drupal\cadbury_ps_api\Models;

use Drupal\node\Entity\Node;
use Drupal\cadbury_ps_api\Models\RelationshipItem;

/**
 * This is the model class for the Relationship content type
 *
 * @property $categories
 * @property $images
 */

class Relationship extends Option  {

    const TYPE = "ps_option_relationship";
    
    public $categories;
    public $images;
    
    /**
     * Returns all the relationship type in a formatted array
     *
     * @return array
     */
    public static function getFormattedTypes(){
        $results = [];
        foreach ( self::getAll(self::TYPE) as $node ):
            $results[] = [
                "nid"       =>  (int)$node->id(),
                "type"      =>  self::TYPE,
                "category"  =>  self::getCategories($node),
                "images"    =>  self::getImageStyles($node),
                "items"     =>  RelationshipItem::getAllItems(),
            ];
        endforeach;
        
        return $results;
    }

}