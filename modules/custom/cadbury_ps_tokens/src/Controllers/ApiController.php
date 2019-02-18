<?php

/**
 * @file
 * Contains \Drupal\cadbury_ps_tokens\Controller\ApiController.
 */

namespace Drupal\cadbury_ps_tokens\Controllers;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

use Drupal\cadbury_ps_tokens\Models\User;
use Drupal\cadbury_ps_tokens\Models\Code;
use Drupal\cadbury_ps_tokens\Models\RateLimit;


class ApiController extends ControllerBase {

    /**
     * @inheritDoc
     */
    public function __construct() {
        header('Access-Control-Allow-Origin: *');
    }

    /**
     * Creates a new User using the supplied $_POST['params']
     * Returns the new user ID / token
     *
     * @return string
     */
    public function userCreate($user_id, $token){
        return new JsonResponse(User::create([
            "user_id"   =>  $user_id,
            "token"     =>  $token,
        ]));
    }

    /**
     * Loads the specified user
     *
     * @param int $user_id
     * @param string $token
     * @return int|bool
     */
    public function userLoad($user_id, $token){
        return new JsonResponse(User::load($user_id, $token));
    }

    /**
     * Attempts to claim the provided code for the provided user
     *
     * @param int $user_id
     * @param string $token
     * @param string $code
     * @return array
     */
    public function codeClaim($user_id, $token, $code){

        /*
        if ( RateLimit::canUserClaim($user_id) ){
            return new JsonResponse( Code::claim($user_id, $token, $code) );
        } else {
            $minutes = RateLimit::invalidClaim($user_id);
            $message = 0 === $minutes ? 'Invalid code.' : 'Invalid code. Try again in ' . $minutes . ' minutes.';

            return new JsonResponse([
                "success"   =>  false,
                "message"   =>  $message,
            ]);
        }
        */

        return new JsonResponse( Code::claim($user_id, $token, $code) );
    }


}

