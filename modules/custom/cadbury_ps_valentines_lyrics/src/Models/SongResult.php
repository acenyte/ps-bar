<?php

namespace Drupal\cadbury_ps_valentines_lyrics\Models;

use Drupal\node\Entity\Node;

/**
 * This is the model class for the valentines day campaign SongResult custom schema
 */

class SongResult extends ActiveRecord {

    const SALT = "PM7eBlmCuEblg4MdW9BNqbInnb3CvgxU";

    public $id;
    public $song_id;
    public $cover_id;
    public $to_name;
    public $created;
    
    /**
     * Returns the table name
     *
     * @return string
     */
    public static function tableName() {
        return 'cadbury_ps_valentines_lyrics_song';
    }

    /**
     * Returns the validation rules
     *
     * @return array
     */
    public function rules(){
        return [
            [['song_id','cover_id','to_name','created'], 'required'],
            [['to_name'], 'string', ['max'=>35]],
            [['song_id'], 'integer'],
            [['cover_id'], 'integer'],
        ];
    }

    /**
     * Returns the property lables
     *
     * @return array
     */
    public function labels(){
        return [
            'id'        =>  'ID',
            'song_id'   =>  'Song ID',
            'cover_id'  =>  'Cover ID',
            'to_name'   =>  'To Name',
            'created'   =>  'Created',
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
            "song_id"   =>  [
                "safe"      =>  true,
                "type"      =>  "int",
            ],
            "cover_id"   =>  [
                "safe"      =>  true,
                "type"      =>  "int",
            ],
            "to_name"   =>  [
                "safe"      =>  true,
                "type"      =>  "string",
            ],
            "created"   =>  [
                "safe"      =>  false,
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
        return new SongResult;
    }

    /**
     * Returns a result by supplied ID/token pair
     *
     * @param int $id
     * @param string $token
     * @return string
     */
    public static function load( $id, $token ){
        if ( self::checkToken($id, $token) ){

            $model = self::loadById($id, self::tableName(), new SongResult);

            return [
                "success"   =>  true,
                "data"      =>  $model,
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }

    /**
     * Validates the provided token against the supplied ID by recreating the 
     *
     * @param int $id
     * @param string $token
     * @return bool
     */
    public static function checkToken( $id, $token ){
        return md5( $id . self::SALT ) === $token;
    }

    /**
     * Outputs the modified MP3
     *
     * @param array $data
     * @return void
     */
    public static function downloadMP3($data){

        $getID3 = new \getID3;
        $tagwriter = new \getid3_writetags;

        $paths = self::getPathsFromFile($data['song']);

        // Copy to the temp directory
        copy($paths['source'], $paths['destination']);

        $tagwriter->filename            = $paths['destination'];
        $tagwriter->tagformats          = array('id3v2.4');
        $tagwriter->overwrite_tags      = true;
        $tagwriter->remove_other_tags   = true;
        $tagwriter->tag_encoding        = 'UTF-8';

        $cover = $data['cover']; // Currently base64 image data
        $cover = explode( ',', $cover );
        $cover = base64_decode( $cover[1] ); // Convert to image data

        $tag_data = [
            'title'     => array( $data['meta']['songName'] ),
            'artist'    => array( $data['meta']['artist'] ),
            'attached_picture' => [
                [
                    'data'          => $cover,
                    'picturetypeid' => 3,
                    'mime'          => 'image/jpeg',
                    'description'   => 'Cadbury Valentines',
                ]
            ]
        ];

        $tagwriter->tag_data = $tag_data;

        if ($tagwriter->WriteTags()){
            header("Content-Description: File Transfer"); 
            header("Content-Type: application/octet-stream"); 
            header("Content-Disposition: attachment; filename='" . $data['meta']['songName'] . ".mp3" . "'"); 
            readfile ($paths['destination']);
            unlink($paths['destination']);
            exit();
        } else {
            print_r($tagwriter->errors);
            die("error1");
        }
    }

    /**
     * Gets the file path array (source and destination) from an absolute file path string
     *
     * @param string $file
     * @return Array
     */
    private static function getPathsFromFile($file){
        $parts = explode("/sites/default/files/", $file);

        // Make the temp directory if not exists
        if ( !file_exists( getcwd() . '/sites/default/files/___valentines') ) {
            mkdir(getcwd() . '/sites/default/files/___valentines', 0777, true);
        }

        return [
            "source"        =>  getcwd() . "/sites/default/files/" . $parts[1],
            "destination"   =>  getcwd() . "/sites/default/files/___valentines/" . uniqid() . ".mp3",
        ];
    }

}
