<?php

namespace Drupal\cadbury_ps_valentines_lyrics\Models;

use Drupal\node\Entity\Node;

/**
 * This is the model class for the valentines day campaign Entry custom schema
 */

class Song {

    const TYPE = "ps_valentines_song";

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

        $songs = Node::loadMultiple($nids);

        foreach ( $songs as $node ):

            $results[] = [
                "nid"       =>  (int)$node->id(),
                "type"      =>  self::TYPE,
                "title"     =>  $node->title->value,
                "file"      =>  $node->field_ps_audio_file->target_id == null ? null : file_create_url( $node->field_ps_audio_file->entity->getFileUri() ),
                "cover"     =>  $node->field_ps_image->target_id == null ? null : file_create_url( $node->field_ps_image->entity->getFileUri() ),
                "artist"    =>  $node->field_ps_artist->value,
                "language"  =>  $node->field_ps_language->value,
            ];

        endforeach;

        return $results;
    }
    
}
