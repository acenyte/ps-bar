<?php 

namespace Drupal\cadbury_ps_api\Models;

use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class Category  {

    const TYPE = "ps_category";

    /**
     * Returns all the categories
     *
     * @return array
     */
    public static function getAll(){
        $results = [];

        $categories = \Drupal::entityTypeManager()
            ->getStorage('taxonomy_term')
            ->loadTree(self::TYPE,0,1);
        
        $i = 0;
        foreach ( $categories as $category ):
            $term = Term::load( $category->tid );

            $results[] = [
                "tid"   =>  (int)$category->tid,
                "name"  =>  $term->name->value,
                "color" =>  $term->field_ps_color->value,
                "rank"  =>  $i,
            ];
            $i++;
        endforeach;

        return $results;
    }

}