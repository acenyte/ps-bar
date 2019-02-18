<?php 

namespace Drupal\cadbury_ps_tokens\Models;

use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

use Drupal\cadbury_ps_tokens\Models\User;

class Code extends ActiveRecord {
    
    public $id;
    public $claim_code;
    public $type;
    public $claim_value;
    public $claimed;
    public $active;
    public $created;

    const BONUS_VALUE = 1000;
    const BONUS_TRIGGER_AMOUNT = 8;
    const DEFAULT_CODE_VALUE = 1000;

    const TABLE_USER_CODE = "cadbury_ps_tokens_user_code";

    /**
     * Returns the table name
     *
     * @return string
     */
    public static function tableName() {
        return 'cadbury_ps_tokens_code';
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
            "claim_code"    =>  [
                "safe"  =>  true,
                "type"  =>  "string",
            ],
            "type"    =>  [
                "safe"  =>  false,
                "type"  =>  "string",
            ],
            "claim_value"    =>  [
                "safe"  =>  false,
                "type"  =>  "int",
            ],
            "claimed"    =>  [
                "safe"  =>  true,
                "type"  =>  "bool",
            ],
            "active"    =>  [
                "safe"  =>  false,
                "type"  =>  "bool",
            ],
            "created"    =>  [
                "safe"  =>  false,
                "type"  =>  "string",
            ],
        ];
    }

    /**
     * Gives the user a bonus if applicable
     *
     * @param User $user_id
     * @return bool
     */
    public static function checkBonus($user){

        $claims = \Drupal::database()
            ->select( self::TABLE_USER_CODE , 'results', [])
            ->condition('user_id', $user->id, '=')
            ->fields('results')
            ->execute(); 

        $is_bonus = (count($claims->fetchAll()) % self::BONUS_TRIGGER_AMOUNT) == 0;

        if ( $is_bonus ){
            $user->balance = $user->balance + self::BONUS_VALUE;
            $user->save();
        }

        return $is_bonus;
    }

    /**
     * Stores the user / code relationshipt
     *
     * @param int $user_id
     * @param int $code_id
     * @return void
     */
    public static function createUserCode($user_id, $code_id){
        return \Drupal::database()
            ->insert( self::TABLE_USER_CODE )
            ->fields([
                "user_id",
                "code_id",
                "created",
            ])
            ->values([
                $user_id,
                $code_id,
                date("Y-m-d H:i:s"),
            ])
            ->execute();
    }


    /**
     * Checks if the inputted codes first 2 characters match any of the possible tables
     *
     * @param string $code The inputted code
     * @return bool
     */
    public static function validatePotentialCode($code){
        $valid = [];

        for ( $i = 0; $i <= 99; $i++ ){
            if ( $i < 10 ){
                $i = "0" . $i;
            }
            $valid[] = $i;
        }

        if ( strlen($code) >= 2 ){
            $code = strrev($code);
            $check = $code[0] . $code[1];

            if ( in_array($check, $valid) ){
                return true;
            }
        }

        return false;
    }

    /**
     * Attempts to claim the specified code for the specified user
     *
     * @param int $user_id
     * @param string $token
     * @param string $code
     * @return array
     */
    public static function claim($user_id, $token, $code){

        $user = User::loadByProperties([
            "user_id"   =>  $user_id,
            "token"     =>  $token,
        ], User::tableName(), new User() );

        if ( false !== $user ){

            if ( self::validatePotentialCode($code) ){

                $code = strrev($code);
                $a = $code[0];
                $b = $code[1];
                $code = strrev($code);
                
                $model = self::loadByProperties([
                    "claim_code" => $code,
                    "claimed"    =>  0,
                    "active"     =>  1,
                ], self::tableName() . "_" . $a . $b, new Code() );

                if ( false != $model ){

                    // Save the claimed 
                    $update = \Drupal::database()
                        ->update( self::tableName() . "_" . $a . $b )
                        ->fields(["claimed"=>1])
                        ->condition('id', $model->id, '=')
                        ->execute();

                    // Update the user to increase their balance
                    $user->balance = $user->balance + $model->claim_value;
                    $user->save();
    
                    self::createUserCode($user->id, $model->id);
    
                    // Check if user gets a bonus for nth claim
                    if ( self::checkBonus($user) ){
                        return [
                            "success"   =>  true,
                            "message"   =>  t('Bonus'),
                        ];
                    }
    
                    return [
                        "success"   =>  true,
                        "message"   =>  t('Claimed'),
                    ];
                }
            }

            return [
                "success"   =>  false,
                "message"   =>  t('Invalid code'),
            ];
        }

        return [
            "success"   =>  false,
            "message"   =>  t('No such user'),
        ];

    }

    /**
     * Creates a new code item
     *
     * @param string $code
     * @return void
     */
    public static function create($code, $source){

        $table = "cadbury_ps_tokens_code_" . $code[strlen($code) - 1] . $code[strlen($code) - 2];

        return \Drupal::database()
            ->insert( $table )
            ->fields([
                "claim_code",
                "type",
                "claim_value",
                "claimed",
                "active",
                "created",
            ])
            ->values([
                $code,
                $source,
                self::DEFAULT_CODE_VALUE,
                0,
                1,
                date("Y-m-d H:i:s"),
            ])
            ->execute();
    }

}

