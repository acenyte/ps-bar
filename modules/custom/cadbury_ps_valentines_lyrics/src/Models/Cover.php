<?php

namespace Drupal\cadbury_ps_valentines_lyrics\Models;

use Drupal\node\Entity\Node;

/**
 * This is the model class for the valentines day campaign Entry content type
 */

class Cover {

    const TYPE = "ps_valentines_cover";

    /**
     * Returns all items of this content type
     */
    public static function getAll(){
        $results = [];

        $nids = \Drupal::entityQuery('node')
            ->condition('type',[self::TYPE])
            ->condition('status',TRUE)
            ->sort('created', 'DESC')
            ->execute();

        $covers = Node::loadMultiple($nids);

        foreach ( $covers as $node ):

            $results[] = [
                "nid"           =>  (int)$node->id(),
                "type"          =>  self::TYPE,
                "cover"         =>  $node->field_ps_image->target_id == null ? null : file_create_url( $node->field_ps_image->entity->getFileUri() ),
                "background"    =>  $node->field_ps_text_background_color->value,
            ];

        endforeach;

        return $results;
    }
    
}

