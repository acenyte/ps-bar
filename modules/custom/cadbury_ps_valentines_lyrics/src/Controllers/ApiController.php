<?php

/**
 * @file
 * Contains \Drupal\cadbury_ps_valentines_lyrics\Controller\ApiController.
 */

namespace Drupal\cadbury_ps_valentines_lyrics\Controllers;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\cadbury_ps_valentines_lyrics\Models\Entry;
use Drupal\cadbury_ps_valentines_lyrics\Models\SongResult;
use Drupal\cadbury_ps_valentines_lyrics\Models\Song;
use Drupal\cadbury_ps_valentines_lyrics\Models\Message;
use Drupal\cadbury_ps_valentines_lyrics\Models\Cover;
use Symfony\Component\HttpFoundation\RedirectResponse;

class ApiController extends ControllerBase {

    const DOWNLOAD_MODE_ALL = "all";
    const DOWNLOAD_MODE_STARRED = "starred";
    const DOWNLOAD_MODE_SELECTED = "selected";

    /**
     * @inheritDoc
     */
    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS');
    }

    /**
     * Validates and creates a new user entry
     *
     * @return string
     */
    public function entryCreate(){

        $response = [];
        $data = $_POST;
        if ( null == $data ){
            $data = $input = json_decode( file_get_contents('php://input'), true );
        }

        $entry = new Entry();
        $entry->meta_lyrics = $data['lyrics'] ?? null;
        $entry->meta_message = $data['message'] ?? null;
        $entry->meta_song_name = $data['song_name'] ?? null;
        $entry->entry_name = $data['entry_name'] ?? null;
        $entry->entry_email = $data['entry_email'] ?? null;
        $entry->entry_mobile = $data['entry_mobile'] ?? null;
        $entry->entry_terms = $data['entry_terms'] ?? null;
        $entry->created = date("Y-m-d H:i:s");
        $valid = $entry->validate();

        $over_max_entries = Entry::overMaxEntries($entry->entry_email);

        if ( $valid['valid'] && !$over_max_entries ){

            // Create the entry
            $entry->save();

            $response = [
                "success"   =>  true,
            ];
        } else {
            if ( $over_max_entries ){
                $response = [
                    "success"   =>  false,
                    "errors"    =>  [
                        "MAX_ENTRIES",
                    ],
                ];
            } else {
                $response = [
                    "success"   =>  false,
                    "errors"    =>  $valid['errors'],
                ];
            }
        }

        return new JsonResponse($response);
    }

    /**
     * Saves the created song result to the database
     *
     * @return string
     */
    public function songResultCreate(){
        $response = [];
        $data = $_POST;
        if ( null == $data ){
            $data = $input = json_decode( file_get_contents('php://input'), true );
        }

        $song_result = new SongResult();
        $song_result->song_id = $data['song_id'] ?? null;
        $song_result->cover_id = $data['cover_id'] ?? null;
        $song_result->to_name = $data['to_name'] ?? null;

        if ( array_key_exists("meta", $data) ){
            $song_result->meta = $data['meta']['image'] ?? null;
        }
        
        $song_result->created = date("Y-m-d H:i:s");

        $valid = $song_result->validate();

        if ( $valid['valid'] ){
            $id = $song_result->save();
            
            $response = [
                "success"   =>  true,
                "data"      =>  [
                    "id"        =>  $id,
                    "token"     =>  md5($id . SongResult::SALT),
                ],
            ];
        } else {
            $response = [
                "success"   =>  false,
                "errors"    =>  $valid['errors'],
            ];
        }

        return new JsonResponse($response);
    }

    /**
     * Loads a specified song result by id / token
     *
     * @return string
     */
    public function songResultLoad($id, $token){
        return new JsonResponse(SongResult::load( $id, $token ));
    }

    /**
     * Ajax call to update an entries status
     *
     * @return string
     */
    public function updateEntryStatus(){
        Entry::updateStatus($_POST['id'], $_POST['mode'], $_POST['set']);
        return new JsonResponse([]);
    }

    /**
     * Returns all content
     *
     * @return string
     */
    public function content(){
        $songs = Song::getAll();
        $covers = Cover::getAll();
        $messages = Message::getAll();

        return new JsonResponse([
            "songs"     =>  $songs,
            "covers"    =>  $covers,
            "messages"  =>  $messages,
        ]);
    }

    /**
     * Downloads the provided song result
     *
     * @return file
     */
    public function songResultDownload($id, $token){

        $post = json_decode( file_get_contents('php://input'), true );

        // Load the result
        $song_result = SongResult::load( $id, $token );

        if ( $song_result['success'] ){

            $data = [];

            // Load the songs
            $songs = Song::getAll();

            // Get the song from the result
            foreach( $songs as $song ):
                if ( $song['nid'] == $song_result['data']->song_id ){
                    $data['song'] = $song['file'];
                }
            endforeach;

            // Set the cover from POST array
            $data['cover'] = $post['imageData'];
            $data['meta'] = $post['meta'];

            // Output the MP3
            SongResult::downloadMP3($data);
        } else {
            die("error");
        }
        
    }

    /**
     * Outputs the song result image by id/token
     *
     * @param int $id
     * @param string $token
     * @return string
     */
    public function displaySongResultImage($id, $token){
        $result = SongResult::load($id, $token);
        $image = str_replace('data:image/jpeg;base64,', '', $result['data']->meta);
        header('Content-Type: image/jpeg');
        echo base64_decode( $image );
        die;
    }

    /**
     * Downloads all the entries for the valentines competition
     * 
     * @return file
     */
    public function download($mode){
        $results = [];
        $query = self::getDownloadModeQuery($mode);

        // Prepare the file name
        $filename = preg_replace("/\W|_/", "", $mode) . "-" . time() . ".csv";

        if ( NULL != $query ){
            $results = self::buildCSVArray($query);
        }

        header('Content-Type: application/csv');
        header("Content-Disposition: attachment; filename='$filename'"); 

        $out = fopen('php://output', 'w');

        fputcsv($out, ["entry_name", "entry_email", "entry_mobile", "meta_lyrics", "meta_message", "meta_song_name", "moderated", "starred", "selected", "created"], ";");
        foreach( $results as $result ):
            fputcsv($out, $result, ";");
        endforeach;
        
        fclose($out);
        exit();
    }

    /**
     * Returns the query for the provided $mode
     * 
     * @param string $mode The query mode
     * @return \Drupal::database The Drupal database query object | NULL
     */
    private static function getDownloadModeQuery($mode){
        $query = NULL;

        switch ($mode){
            case self::DOWNLOAD_MODE_ALL:
                $query = \Drupal::database()
                    ->select( Entry::tableName() , 'results', [] )
                    ->fields('results');
                break;

            case self::DOWNLOAD_MODE_STARRED:
                $query = \Drupal::database()
                    ->select( Entry::tableName() , 'results', [] )
                    ->condition('starred', 1, '=')
                    ->fields('results');
                break;

            case self::DOWNLOAD_MODE_SELECTED:
                $query = \Drupal::database()
                    ->select( Entry::tableName() , 'results', [] )
                    ->condition('selected', 1, '=')
                    ->fields('results');
                break;
        }

        return $query;
    }

    /**
     * Returns the array to output for the provided Drupal database query
     * 
     * @param $query \Drupal::database
     * @return array
     */
    private static function buildCSVArray($query){
        $results = [];

        $entries = $query->execute()->fetchAll();

        foreach( $entries as $entry ):

            $results[] = [
                $entry->entry_name,
                $entry->entry_email,
                $entry->entry_mobile,
                $entry->meta_lyrics,
                $entry->meta_message,
                $entry->meta_song_name,
                $entry->moderated,
                $entry->starred,
                $entry->selected,
                $entry->created,
            ];
        endforeach;

        return $results;
    }
}