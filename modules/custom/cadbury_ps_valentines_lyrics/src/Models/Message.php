<?php

namespace Drupal\cadbury_ps_valentines_lyrics\Models;

use Drupal\node\Entity\Node;

/**
 * This is the model class for the valentines day campaign Message content type
 */

class Message {

    const TYPE = "ps_valentines_message";

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

        $messages = Node::loadMultiple($nids);

        foreach ( $messages as $node ):

            $results[] = [
                "nid"       =>  (int)$node->id(),
                "type"      =>  self::TYPE,
                "title"     =>  $node->title->value,
                "cover"     =>  $node->field_ps_image->target_id == null ? null : file_create_url( $node->field_ps_image->entity->getFileUri() ),
            ];

        endforeach;

        return $results;
    }
    
}

