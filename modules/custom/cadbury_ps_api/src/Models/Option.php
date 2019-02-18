<?php 

namespace Drupal\cadbury_ps_api\Models;

use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class Option {

    const IMAGE_STYLES = [
        "thumbnail",
    ];
 
    /**
     * Returns the categories for the provided Node
     *
     * @param Relationship|Illustration|Booklet $node
     * @return array
     */
    public static function getCategories($node){
        $return = [];
        
        foreach ( $node->field_ps_category as $category ):
            $term = Term::load($category->target_id);
            $return[] = [
                "tid"   =>  (int)$term->tid->value,
            ];
        endforeach;

        return $return;
    }

    /**
     * Returns the image styles for the supplied node
     *
     * @param Relationship|Illustration|Booklet $node
     * @return array
     */
    public static function getImageStyles($node, $field = null){

        if ( null === $field ){
            $field = "field_ps_image";
        }

        $result = [];
        foreach ( self::IMAGE_STYLES as $style):
            $this_style = \Drupal::entityTypeManager()
                ->getStorage('image_style')
                ->load($style);
            $result[$style] = $node->$field->entity == null ? null : file_create_url($this_style->buildUrl($node->$field->entity->getFileUri())); 
        endforeach;

        // Also output the original size
        $result["original"] = $node->$field->entity != null ? file_create_url($node->$field->entity->getFileUri()) : null; 

        return $result;
    }

    /**
     * Returns all nodes for the provided type
     *
     * @param string $type
     * @return array
     */
    public static function getAll( $type ){
        $nids = \Drupal::entityQuery('node')
            ->condition('type',[$type])
            ->condition('status',TRUE)
            ->sort('created' , 'DESC')
            ->execute();

        return Node::loadMultiple($nids);
    }
    
}