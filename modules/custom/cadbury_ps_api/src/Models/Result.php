<?php 

namespace Drupal\cadbury_ps_api\Models;

class Result {

    const SALT = "CFd37mVWN1ND9eoBgYTPNmtiYmPuYhQ1"; 
    const TABLE = "cadbury_ps_api_result";

    const FACEBOOK_GRAPH_URL = "https://graph.facebook.com";
    const FACEBOOK_ACCESS_TOKEN = "391557604640769|OsvOux25-xHAG2ZhdSKe3KiL-qM";

    public $id;
    public $token;
    public $user_id;
    public $type;
    public $nid;
    public $meta;
    public $created;

    /**
     * Returns a result by supplied ID/token pair
     *
     * @param int $id
     * @param string $token
     * @return string
     */
    public static function load( $id, $token ){
        if ( self::checkToken($id, $token) ){
            $query = \Drupal::database()
                ->select(self::TABLE, 'result', [])
                ->condition('id', $id, '=')
                ->fields('result', ['id','user_id','type','nid','meta','created'])
                ->execute();

            $results = $query->fetchAll();

            $data = [];

            foreach ( $results as $result ):
                $data = [
                    "id"        =>  (int)$result->id,
                    "user_id"   =>  $result->user_id,
                    "type"      =>  $result->type,
                    "nid"       =>  (int)$result->nid,
                    "meta"      =>  $result->meta,
                    "created"   =>  $result->created,
                ];

            endforeach;
            
            return [
                "success"   =>  true,
                "data"      =>  $data,
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }

    /**
     * Creates a new result with the set properties
     *
     * @param string $data
     * @return int $id The ID of thew newly created record
     */
    public function create($data){

        $model = new Result;
        $model->user_id = $data['user_id'];;
        $model->type = $data['type'];
        $model->nid = $data['nid'];
        $model->meta = json_encode($data['meta']);
        $model->created = date("Y-m-d H:i:s");

        return self::save($model);
    }

    /**
     * Saves the current Result
     *
     * @return int $id
     */
    private static function save($model){
        return \Drupal::database()
            ->insert(self::TABLE)
            ->fields([
                "user_id",
                "type",
                "nid",
                "meta",
                "created"
            ])
            ->values([
                $model->user_id,
                $model->type,
                $model->nid,
                $model->meta,
                $model->created,
            ])
            ->execute();
    }

    /**
     * Returns a token for the provided ID
     *
     * @param int $id
     * @return string
     */
    public static function getToken($id){
        return md5( $id . self::SALT );
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
     * Makes a request to the Facebook API to scrape the share URL
     *
     * @param int $id The ID of the result to scrape
     * @param string $token The result token
     * @return void
     */
    public static function scrapeFacebook($id, $token){
        $host = \Drupal::request()->getSchemeAndHttpHost();
        $post_data = [
            'id'            => $host . '/ps/result/' . $id . '/' . $token,  
            'scrape'        => true,
            'access_token'  => self::FACEBOOK_ACCESS_TOKEN,
        ];

        $ch = curl_init(self::FACEBOOK_GRAPH_URL);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);

        $response = curl_exec($ch);
        curl_close($ch);

        /*
        $host = \Drupal::request()->getSchemeAndHttpHost();
        $vars = [
            'id'            => $host . '/ps/result/' . $id . '/' . $token,  
            'scrape'        => true,
            'access_token'  => self::FACEBOOK_ACCESS_TOKEN,
        ];

        $body = http_build_query($vars);
        $fp = fsockopen('ssl://graph.facebook.com', 443);
        fwrite($fp, "POST / HTTP/1.1\r\n");
        fwrite($fp, "Host: graph.facebook.com\r\n");
        fwrite($fp, "Content-Type: application/x-www-form-urlencoded\r\n");
        fwrite($fp, "Content-Length: ".strlen($body)."\r\n");
        fwrite($fp, "Connection: close\r\n");
        fwrite($fp, "\r\n");
        fwrite($fp, $body);
        fclose($fp);
        */

    }
    
}