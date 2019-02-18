<?php 

namespace Drupal\cadbury_ps_tokens\Models;

use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class RateLimit extends ActiveRecord {
    
    public $id;
    public $user_id;
    public $attempts;
    public $next_attempt;

    /**
     * Returns the table name
     *
     * @return string
     */
    public static function tableName() {
        return 'cadbury_ps_tokens_rate_limit';
    }

    /**
     * Returns the property properties
     *
     * @return array
     */
    public static function getProperties(){
        return [
            "id"    =>  [
                "safe"  =>  false,
                "type"  =>  "int",
            ],
            "user_id"    =>  [
                "safe"  =>  true,
                "type"  =>  "int",
            ],
            "attempts"    =>  [
                "safe"  =>  false,
                "type"  =>  "int",
            ],
            "claim_value"    =>  [
                "safe"  =>  false,
                "type"  =>  "int",
            ],
            "next_attempt"    =>  [
                "safe"  =>  false,
                "type"  =>  "string",
            ],
        ];
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

    /**
     * Updates the invalid claim for the specified user
     *
     * @return void
     */
    public static function invalidClaim($user_id){
        // Check if the user already has a rate limit entry, if not create entry
        // Load the entry by user ID
        $model = self::loadByProperties(
            ["user_id" => $user_id],
            self::tableName(),
            new RateLimit
        );

        // No record exists for the supplied user, create entry
        if ( false === $model ){
            $model = new RateLimit;
            $model->user_id = $user_id;
            $model->attempts = 0;
            $model->next_attempt = date("Y-m-d H:i:s");
            $model->save();
        } 

        $model = self::loadByProperties(
            ["user_id" => $user_id],
            self::tableName(),
            new RateLimit
        );

        $model->attempts = $model->attempts + 1;
        
        // Set when next attempt is
        $minutes = 0;
        if ( $model->attempts >= 3 ){
            $minutes = 5;
            $model->next_attempt = date("Y-m-d H:i:s", strtotime($time . '+5 minute'));
        }

        if ( $model->attempts >= 6 ){
            $minutes = 15;
            $model->next_attempt = date("Y-m-d H:i:s", strtotime($time . '+15 minute'));
        }

        if ( $model->attempts >= 9 ){
            $minutes = 60;
            $model->next_attempt = date("Y-m-d H:i:s", strtotime($time . '+60 minute'));
        }

        $model->save();
        return $minutes;
    }

    /**
     * Returns the next allowed claim attempt
     *
     * @param int $user_id
     * @return string
     */
    public static function checkNextClaimAttempt( $user_id ) {
        $model = self::loadByProperties(
            ["user_id" => $user_id],
            self::tableName(),
            new RateLimit
        );

        if ( false === $model ){
            return $model->next_attempt;
        }

        // User can claim, return time 1 minute ago
        return date("Y-m-d H:i:s", strtotime($time . '-1 minute'));
    }

    /**
     * Returns whether the user is allowed to make a claim attempt or not
     *
     * @param int $user_id
     * @return boolean
     */
    public static function canUserClaim( $user_id ){
        if ( strtotime(date("Y-m-d H:i:s") > strtotime(self::checkNextClaimAttempt($user_id)) ) ){
            return true;
        }
        return false;
    }

}