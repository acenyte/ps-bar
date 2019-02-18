<?php

namespace Drupal\cadbury_ps_valentines_lyrics\Models;

use Drupal\node\Entity\Node;

/**
 * This is the model class for the valentines day campaign Entry custom schema
 */

class Entry extends ActiveRecord {

    const MAX_ENTRIES = 3;
    
    public $id;
    public $meta_lyrics;
    public $meta_message;
    public $meta_song_name;
    public $created;
    public $starred;
    public $moderated;
    public $selected;
    public $entry_name;
    public $entry_email;
    public $entry_mobile;
    public $entry_terms;

    /**
     * Returns the table name
     *
     * @return string
     */
    public static function tableName() {
        return 'cadbury_ps_valentines_lyrics_entry';
    }

    /**
     * Returns the validation rules
     *
     * @return array
     */
    public function rules(){
        return [
            [['meta_lyrics', 'created', 'meta_message', 'meta_song_name', 'entry_name', 'entry_email', 'entry_mobile', 'entry_terms'], 'required'],
            [['meta_lyrics'], 'string', ['max'=>350]],
            [['meta_message'], 'integer'],
            [['entry_name'], 'string', ['max'=>35]],
            [['entry_mobile'], 'string', ['max'=>10]],
            [['entry_mobile'], 'string', ['min'=>10]],
            [['entry_email'], 'string', ['max'=>50]],
            [['meta_song_name'], 'string', ['max'=>20]],
        ];
    }

    /**
     * Returns the property lables
     *
     * @return array
     */
    public function labels(){
        return [
            'id'                =>  'ID',
            'meta_lyrics'       =>  'Lyrics',
            'meta_message'      =>  'Message',
            'meta_song_name'    =>  'Song Name',
            'entry_name'        =>  'Name',
            'entry_email'       =>  'Email',
            'entry_mobile'      =>  'Mobile Number',
            'entry_terms'       =>  'Terms',
            'created'           =>  'Created',
        ];
    }

    /**
     * Returns the property properties
     *
     * @return array
     */
    public static function getProperties(){
        return [
            "id"            =>  [
                "safe"      =>  false,
                "type"      =>  "int",
            ],
            "meta_lyrics"   =>  [
                "safe"      =>  true,
                "type"      =>  "string",
            ],
            "meta_to"   =>  [
                "safe"      =>  true,
                "type"      =>  "string",
            ],
            "meta_name"   =>  [
                "safe"      =>  true,
                "type"      =>  "string",
            ],
            "meta_song_name"   =>  [
                "safe"      =>  true,
                "type"      =>  "string",
            ],
            "created"       =>  [
                "safe"      =>  false,
                "type"      =>  "string",
            ],
            "starred"       =>  [
                "safe"      =>  true,
                "type"      =>  "string",
            ],
            "moderated"       =>  [
                "safe"      =>  true,
                "type"      =>  "string",
            ],
            "selected"       =>  [
                "safe"      =>  true,
                "type"      =>  "string",
            ],
        ];
    }

    /**
     * Returns as new instance of this class
     *
     * @return void
     */
    public function factory(){
        return new Entry;
    }

    /**
     * Returns if the supplied user has entered more than the max amount of times
     *
     * @return void
     */
    public static function overMaxEntries($email){

        // Load all other entries by this user
        $entries = self::loadByProperties(
            [
                "entry_email" => $email
            ],
            self::tableName(),
            self::factory()
        );

        if ( count($entries) >= self::MAX_ENTRIES ){
            return true;
        } 

        return false;
    }

    /**
     * Updates the provided entry id with the supplied mode/value
     *
     * @param int $id
     * @param string $mode
     * @param int $set
     * @return void
     */
    public static function updateStatus($id, $mode, $set){
        $model = self::loadById($id, self::tableName(), new Entry);
        
        switch ( $mode ){
            case "starred":
                $model->starred = (int)$set;
            break;

            case "moderated":
                $model->moderated = (int)$set;
            break;

            case "selected":
                $model->selected = (int)$set;
            break;
        }

        $model->save();
    }

    
    /**
     * Returns the language string for the provided message ID
     *
     * @param int $message_id
     * @return string
    */
    public static function getLanguageString($message_id){
        $message = "";
        if ( NULL != Node::load($message_id) ){
            $message = Node::load($message_id)->getTitle();
        }
        return $message;
    }
}
