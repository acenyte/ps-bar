<?php

namespace Drupal\cadbury_ps_api\Models;

use Drupal\node\Entity\Node;

/**
 * This is the model class for the Gif content type
 *
 * @property $categories
 * @property $images
 */

class ValentinesSong extends Option  {

    const TYPE = "ps_option_valentines_song";

    public $categories;
    public $images;

    /**
     * Returns all the gif type in a formatted array
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
            ];
        endforeach;

        return $results;
    }

    /**
     * Returns the thumbnail field file for the current node
     *
     * @param Node $node
     * @return array
     */
    private function getThumbNail($node){
        $result = $node->field_pc_thumbnail->entity != null ? file_create_url($node->field_pc_thumbnail->entity->getFileUri()) : null; 
        return $result;
    }

}
