<?php 

namespace Drupal\cadbury_ps_api\Models;

use Drupal\node\Entity\Node;

use Drupal\cadbury_ps_api\Models\Booklet;


/**
 * This is the model class for the IOU content type
 *
 * @property $categories
 * @property $images
 */

class IOU extends Option  {

    const TYPE = "ps_option_iou";
    
    public $categories;
    public $images;
    
    /**
     * Returns all the relationship type in a formatted array
     *
     * @return array
     */
    public static function getFormattedTypes(){

        foreach ( self::getAll(self::TYPE) as $node ):
            $results[] = [
                "nid"       =>  (int)$node->id(),
                "type"      =>  self::TYPE,
                "category"  =>  self::getCategories($node),
                "images"    =>  self::getImageStyles($node),
                "covers"    =>  Booklet::getCovers(),
                "pages"     =>  Booklet::getPages(),
            ];
        endforeach;
        
        return $results;
    }

}