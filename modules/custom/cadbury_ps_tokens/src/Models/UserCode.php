<?php 

namespace Drupal\cadbury_ps_tokens\Models;

use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class UserCode extends ActiveRecord {
    
    public $id;
    public $user_id;
    public $gift_id;
    public $created;

    /**
     * Returns the table name
     *
     * @return string
     */
    public static function tableName() {
        return 'cadbury_ps_tokens_user_code';
    }

    /**
     * Loads a specified UserCode by id
     *
     * @param int $id
     * @return UserCode[]
     */
    public static function load($id){
        return self::loadById($id, self::tableName());
    }
}