<?php 

namespace Drupal\cadbury_ps_api\Models;

use Drupal\node\Entity\Node;

/**
 * This is the model class for the Booklet content type
 *
 * @property $categories
 * @property $images
 */

class Booklet extends Option {

    const COVER_TYPE = "ps_iou_cover";
    const PAGE_TYPE = "ps_iou_page";

    public static function getCovers(){
        $result = [];
        foreach ( self::getAll(self::COVER_TYPE) as $node ):
            $result[] = [
                "nid"                   =>  $node->nid->value,
                "image"                 =>  self::getImageStyles($node),
                "textBackgroundColor"   =>  $node->field_ps_text_background_color->value,
            ];
        endforeach;
        return $result;
    }

    public static function getPages(){
        $result = [];
        foreach ( self::getAll(self::PAGE_TYPE) as $node ):
            $result[] = [
                "nid"       =>  $node->nid->value,
                "image"     =>  self::getImageStyles($node),
            ];
        endforeach;
        return $result;
    }

}