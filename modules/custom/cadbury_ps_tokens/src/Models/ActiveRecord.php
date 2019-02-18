<?php

namespace Drupal\cadbury_ps_tokens\Models;

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

}
