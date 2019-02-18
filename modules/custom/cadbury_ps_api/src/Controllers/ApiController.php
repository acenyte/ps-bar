<?php

/**
 * @file
 * Contains \Drupal\cadbury_ps_api\Controller\ApiController.
 */

namespace Drupal\cadbury_ps_api\Controllers;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Form\FormState;

use Drupal\taxonomy\Entity\Term;
use Drupal\node\Entity\Node;

use Drupal\cadbury_ps_api\Models\Category;
use Drupal\cadbury_ps_api\Models\Relationship;
use Drupal\cadbury_ps_api\Models\Personalised;
use Drupal\cadbury_ps_api\Models\IOU;
use Drupal\cadbury_ps_api\Models\Bar;
use Drupal\cadbury_ps_api\Models\Result;
use Drupal\cadbury_ps_api\Models\Gif;

use Drupal\cadbury_ps_api\Models\ValentinesCompetition;
use Drupal\cadbury_ps_api\Models\ValentinesSong;

use Symfony\Component\HttpFoundation\RedirectResponse;

class ApiController extends ControllerBase {

    const OAUTH_LOGOUT_URL = "https://cadbury.co.za/auth/logout";
    const AFTER_REDIRECT_URL = "https://cadbury.co.za/psbar";

    /**
     * @inheritDoc
     */
    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS');
    }

    /**
     * Returns the application content
     *
     * @return string
     */
    public function content(){
        $options = [];

        foreach ( Relationship::getFormattedTypes() as $item ):
            $options[] = $item;
        endforeach;

        foreach ( Personalised::getFormattedTypes() as $item ):
            $options[] = $item;
        endforeach;

        foreach ( IOU::getFormattedTypes() as $item ):
            $options[] = $item;
        endforeach;

        foreach ( Bar::getFormattedTypes() as $item ):
            $options[] = $item;
        endforeach;

        foreach ( Gif::getFormattedTypes() as $item ):
            $options[] = $item;
        endforeach;

        foreach ( ValentinesCompetition::getFormattedTypes() as $item ):
            $options[] = $item;
        endforeach;

        foreach ( ValentinesSong::getFormattedTypes() as $item ):
            $options[] = $item;
        endforeach;

        return new JsonResponse([
            "categories"    => Category::getAll(),
            "options"       => $options,
        ]);
    }

    /**
     * Creates a new result
     *
     * @return string
     */
    public function resultCreate(){
        $input = json_decode( file_get_contents('php://input'), true );
        $id = Result::create($input);

        // Scrape the share URL on the facebook debugger
        Result::scrapeFacebook(
            $id,
            Result::getToken($id)
        );

        return new JsonResponse([
            "id"    =>  (int)$id,
            "token" =>  Result::getToken($id),
        ]);
    }

   /**
    * Returns the specified ID/token
    *
    * @param int $id
    * @param string $token
    * @return string
    */
    public function resultLoad($id, $token){
        return new JsonResponse(Result::load( $id, $token ));
    }

    /**
     * Logs out the user 
     *
     * @return json
     */
    public function logout(){
        user_logout();
        $response = new RedirectResponse( self::OAUTH_LOGOUT_URL . "?redirect=" . self::AFTER_REDIRECT_URL );
        $response->send();
        die;
    }
  
}