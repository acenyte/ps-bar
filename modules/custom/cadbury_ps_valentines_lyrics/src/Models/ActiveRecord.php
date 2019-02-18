<?php

namespace Drupal\cadbury_ps_valentines_lyrics\Models;

use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class ActiveRecord {

    /**
     * Saves the current ActiveRecord
     *
     * @return bool
     */
    public function save(){
        $keys = [];
        $values = [];
        $key_values = [];
        $new = true;

        foreach ( $this as $key => $value ):
            if ( "id" == $key){
                if ( "" != $value ){
                    $keys[] = $key;
                    $values[] = $value;
                    $new = false;
                }
            } else {
                $keys[] = $key;
                $values[] = $value;
                $key_values[$key] = $value;
            }
        endforeach;

        if ( $new ){
            return \Drupal::database()
                ->insert( $this->tableName() )
                ->fields($keys)
                ->values($values)
                ->execute();
        } else {
            return \Drupal::database()
                ->update( $this->tableName() )
                ->fields($key_values)
                ->condition('id', $this->id, '=')
                ->execute();
        }
    }

    /**
     * Loads the node with the specified ID for the specified table
     *
     * @param int $id
     * @param string $table
     * @param ActiveRecord $class
     * @return array
     */
    public static function loadById($id, $table, $class){

        $query = \Drupal::database()
            ->select( $table , 'result', [])
            ->condition('id', $id, '=')
            ->fields('result');

        $data = $query->execute()->fetch();

        if ( empty($data) ){
            return false;
        }

        foreach ( $data as $key => $value ):
            $class->$key = $class::setPropertyType( $key, $value , $class::getProperties() );
        endforeach;

        return $class;
    }

    /**
     * Loads a record by the provided properties array
     *
     * @param array $properties
     * @param string $table
     * @param ActiveRecord $class
     * @return array
     */
    public static function loadByProperties($properties, $table, $class){

        $query = \Drupal::database()
            ->select( $table , 'result', [])
            ->fields('result');

        foreach ( $properties as $property => $value ):
            $query->condition($property, $value, "=");
        endforeach;

        $data = $query->execute()->fetchAll();

        if ( empty($data) ){
            return false;
        }

        $results = [];
        
        foreach ( $data as $result ):
            $row = [];
            foreach ( $result as $key => $value ):
                $model = $class::factory();
                $row[$key] = $model::setPropertyType( $key, $value , $model::getProperties() );
            endforeach;
            $results[] = $row;
        endforeach;

        return $results;
    }

    /**
     * Casts the provided property to the specified type
     *
     * @param string $property
     * @param array $value
     * @param array $properties
     * @return ActiveRecord
     */
    public static function setPropertyType( $property, $value, $properties ){
        switch ( $properties[$property]['type'] ){
            case "int":
                return (int) $value;
                break;

            case "bool":
                return (bool) $value;
                break;

            default:
                return $value;
        }
    }

    /**
     * Validates the current object against its validation properties
     *
     * @return bool
     */
    public function validate(){
        $valid = true;
        $errors = [];

        foreach( $this->rules() as $rule ):

            // Index 0 is an array of object properties to validate
            // Index 1 is the rule 
            // Index 2 is any additional rule params

            // Loop the properties
            foreach( $rule[0] as $property ):
                
                switch ( $rule[1] ){
                    case "required":
                        if ( $this->$property == "" || $this->$property == null ){
                            $valid = false;
                            $errors[] = $this->labels()[$property] . " cannot be empty";
                        }
                    break;

                    case "integer":
                        if ( filter_var($this->$property, FILTER_VALIDATE_INT) === false ) {
                            $valid = false;
                            $errors[] = $this->labels()[$property] . " must be an integer";
                        }
                    break;

                    case "string":
                        if ( !is_string($this->$property) ) {
                            $valid = false;
                            $errors[] = $this->labels()[$property] . " must be a string";
                        }

                        // Check additional rules
                        foreach( $rule[2] as $rule => $condition ):
                            
                            switch ( $rule ){
                                case "max":
                                    if ( mb_strlen($this->$property, 'UTF-8') > $condition ){
                                        $valid = false;
                                        $errors[] = $this->labels()[$property] . " cannot be more than " . $condition . " characters";
                                    }
                                break;

                                case "min":
                                    if ( mb_strlen($this->$property, 'UTF-8') < $condition ){
                                        $valid = false;
                                        $errors[] = $this->labels()[$property] . " cannot be less than " . $condition . " characters";
                                    }
                                break;
                            }

                        endforeach;

                    break;
                }

            endforeach;

        endforeach;

        return [
            "valid"     =>  $valid,
            "errors"    =>  $errors,
        ];
    }

}
