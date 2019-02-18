<?php

namespace Drupal\cadbury_ps_api\Models;

use Drupal\node\Entity\Node;

/**
 * This is the model class for the Bar content type
 *
 * @property $categories
 * @property $images
 */

class Bar extends Option  {

    const TYPE = "ps_option_bar";

    public $categories;
    public $images; // Bar
    public $background_images;
    public $bar_images;
    public $headline_images;
    public $description;

    /**
     * Returns all the relationship type in a formatted array
     *
     * @return array
     */
    public static function getFormattedTypes(){
        $results = [];
        foreach ( self::getAll(self::TYPE) as $node ):
            $results[] = [
                "nid"               =>  (int)$node->id(),
                "category"          =>  self::getCategories($node),
                "type"              =>  self::TYPE,
                "images"            =>  self::getImageStyles($node),
                "background_images" =>  self::getImageStyles($node, "field_ps_background_image"),
                "bar_images"        =>  self::getImageStyles($node, "field_ps_chocolate_bar_image"),
                "headline_images"   =>  self::getImageStyles($node, "field_ps_headline_image"),
                "description"       => $node->field_ps_meta_description->value,
                "description_color" => $node->field_ps_desc_color->value,
            ];
        endforeach;

        return $results;
    }

}
