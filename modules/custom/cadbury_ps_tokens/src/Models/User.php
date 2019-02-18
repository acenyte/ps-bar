<?php

namespace Drupal\cadbury_ps_tokens\Models;

use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class User extends ActiveRecord {

    public $id;
    public $user_id;
    public $token;
    public $balance;
    public $created;
    public $user_name;

    const SALT = "c3LcNE2RpldAoWLBL5sqle8jfRFgjEVK";
    const DEFAULT_BALANCE = 1000;

    /**
     * Returns the table name
     *
     * @return string
     */
    public static function tableName() {
        return 'cadbury_ps_tokens_user';
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
            "user_id"   =>  [
                "safe"  =>  true,
                "type"  =>  "int",
            ],
            "user_name" =>  [
                "safe"  =>  true,
                "type"  =>  "string",
            ],
            "token"     =>  [
                "safe"  =>  true,
                "type"  =>  "string",
            ],
            "balance"   =>  [
                "safe"  =>  false,
                "type"  =>  "int",
            ],
            "created"   =>  [
                "safe"  =>  true,
                "type"  =>  "string",
            ],
        ];
    }

    /**
     * Creates a new user with the supplied params
     *
     * @param array $params
     * @return array
     */
    public static function create($params){

        // Check if user alrady exists
        $check_user = User::loadByProperties([
            "user_id"   =>  $params['user_id'],
            "token"     =>  $params['token'],
        ], self::tableName(), new User());

        if ( !empty($check_user) ){
            return [
                "success"   =>  (bool)false,
                "message"   =>  "User already exists",
            ];
        }

        $model = new User();
        foreach ( $model->getProperties() as $property => $value ):
            if ( $value['safe'] && array_key_exists($property, $params)){
                $model->$property = $params[$property];
            }
        endforeach;

        $model->balance = self::DEFAULT_BALANCE;
        $model->created = date('Y-m-d H:i:s');

        $id = $model->save();

        return [
            "success"   =>  (bool)true,
            "user_id"   =>  (int)$model->user_id,
            "token"     =>  $model->token,
        ];
    }

    /**
     * Loads a specified User by id
     *
     * @param int $id
     * @param string $token
     * @return User[]|false
     */
    public static function load($user_id, $token){
        return self::loadByProperties([
            "user_id"   =>  $user_id,
            "token"     =>  $token,
        ], self::tableName(), new User() );
    }

}
